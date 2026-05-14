<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\LearningPathModule;
use App\Models\ModuleQuestion;
use App\Models\UserAnswer;
use App\Models\UserBadge;
use App\Models\UserLearningPathProgress;
use App\Models\UserModuleProgress;
use App\Models\UserPoint;
use App\Models\UserReflection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LearningPathController extends Controller
{
    // ═══════════════════════════════════════════════════════════════════════
    //  HALAMAN DAFTAR LEARNING PATH
    // ═══════════════════════════════════════════════════════════════════════

    public function index()
    {
        $paths = LearningPath::published()
            ->withCount('modules')
            ->get()
            ->map(fn($path) => $this->formatPathCard($path));

        return Inertia::render('LearningPath/Index', [
            'paths' => $paths,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HALAMAN DETAIL LEARNING PATH
    // ═══════════════════════════════════════════════════════════════════════

    public function show(int $id)
    {
        $path = LearningPath::published()->withCount('modules')->findOrFail($id);

        $modules = LearningPathModule::where('id_learning_path', $id)
            ->orderBy('order_number')
            ->get()
            ->map(fn($m) => $this->formatModuleItem($m));

        $progress = $this->getUserPathProgress($id);

        return Inertia::render('LearningPath/Show', [
            'path'     => $this->formatPathDetail($path),
            'modules'  => $modules,
            'progress' => $progress,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MULAI BELAJAR (buat atau ambil progress record)
    // ═══════════════════════════════════════════════════════════════════════

    public function start(int $id)
    {
        $path = LearningPath::published()->findOrFail($id);

        $progress = UserLearningPathProgress::firstOrCreate(
            ['id_user' => Auth::id(), 'id_learning_path' => $id],
            [
                'status'              => UserLearningPathProgress::STATUS_IN_PROGRESS,
                'progress_percentage' => 0,
                'started_at'          => now(),
            ]
        );

        $firstModule = LearningPathModule::where('id_learning_path', $id)
            ->orderBy('order_number')
            ->first();

        return response()->json([
            'first_module_id' => $firstModule?->id_module,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HALAMAN MODUL (pre_test / material / post_test / reflection)
    // ═══════════════════════════════════════════════════════════════════════

    public function module(int $pathId, int $moduleId)
    {
        $path   = LearningPath::published()->findOrFail($pathId);
        $module = LearningPathModule::where('id_learning_path', $pathId)->findOrFail($moduleId);

        $this->guardModuleAccess($pathId, $module);

        // Tandai modul in_progress jika belum
        UserModuleProgress::firstOrCreate(
            ['id_user' => Auth::id(), 'id_module' => $moduleId],
            ['status' => UserModuleProgress::STATUS_IN_PROGRESS]
        );

        return Inertia::render('LearningPath/Module', [
            'path'        => ['id_learning_path' => $path->id_learning_path, 'title' => $path->title, 'grade' => $path->grade],
            'module'      => array_merge($this->formatModuleItem($module), $this->getModuleContent($module)),
            'all_modules' => $this->getAllModulesWithProgress($pathId),
            'progress'    => $this->getUserPathProgress($pathId),
            'next_module' => $this->getAdjacentModule($pathId, $module->order_number, 'next'),
            'prev_module' => $this->getAdjacentModule($pathId, $module->order_number, 'prev'),
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SUBMIT JAWABAN (pre_test / post_test)
    // ═══════════════════════════════════════════════════════════════════════

    public function submitAnswer(Request $request, int $pathId, int $moduleId)
    {
        $request->validate(['answers' => 'required|array']);

        $module = LearningPathModule::where('id_learning_path', $pathId)->findOrFail($moduleId);
        $userId = Auth::id();

        $moduleQuestions = ModuleQuestion::where('id_module', $moduleId)
            ->with(['question.questionOptions', 'question.questionType'])
            ->orderBy('order_number')
            ->get();

        $totalPoints = 0;
        $maxPoints   = 0;
        $results     = [];

        DB::transaction(function () use ($moduleQuestions, $request, $userId, &$totalPoints, &$maxPoints, &$results) {
            foreach ($moduleQuestions as $mq) {
                $question      = $mq->question;
                $submittedAnswer = $request->answers[$question->id_question] ?? null;
                if ($submittedAnswer === null) continue;

                $maxPoints += $question->points;
                [$isCorrect, $answerText] = $this->resolveAnswer($question, $submittedAnswer);

                // Simpan ke user_answers (tabel existing)
                UserAnswer::create([
                    'id_question' => $question->id_question,
                    'id_user'     => $userId,
                    'answer'      => $answerText,
                    'is_correct'  => $isCorrect,
                    'answered_at' => now(),
                ]);

                // Simpan ke user_points (tabel existing) jika benar & belum pernah dapat poin
                if ($isCorrect) {
                    UserPoint::firstOrCreate(
                        ['id_user' => $userId, 'id_question' => $question->id_question],
                        ['points_earned' => $question->points]
                    );
                    $totalPoints += $question->points;
                }

                $results[] = [
                    'id_question' => $question->id_question,
                    'is_correct'  => $isCorrect,
                    'answer'      => $answerText,
                ];
            }
        });

        $scorePercentage = $maxPoints > 0 ? round(($totalPoints / $maxPoints) * 100) : 0;

        // Simpan skor ke user_learning_path_progress
        $pathProgress = UserLearningPathProgress::where('id_user', $userId)
            ->where('id_learning_path', $pathId)
            ->first();

        if ($pathProgress) {
            if ($module->type === LearningPathModule::TYPE_PRE_TEST) {
                $pathProgress->update(['pre_test_score' => $scorePercentage]);
            } elseif ($module->type === LearningPathModule::TYPE_POST_TEST) {
                $pathProgress->update(['post_test_score' => $scorePercentage]);
            }
        }

        $this->completeModule($pathId, $moduleId, $userId);

        return response()->json([
            'score'       => $scorePercentage,
            'total_points'=> $totalPoints,
            'max_points'  => $maxPoints,
            'results'     => $results,
            'next_module' => $this->getAdjacentModule($pathId, $module->order_number, 'next'),
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SELESAIKAN MATERI (tandai modul material selesai dibaca)
    // ═══════════════════════════════════════════════════════════════════════

    public function completeMaterial(int $pathId, int $moduleId)
    {
        $module = LearningPathModule::where('id_learning_path', $pathId)->findOrFail($moduleId);

        $this->completeModule($pathId, $moduleId, Auth::id());

        return response()->json([
            'success'     => true,
            'next_module' => $this->getAdjacentModule($pathId, $module->order_number, 'next'),
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SUBMIT REFLEKSI
    // ═══════════════════════════════════════════════════════════════════════

    public function submitReflection(Request $request, int $pathId, int $moduleId)
    {
        $request->validate([
            'understood_concepts'   => 'nullable|string|max:500',
            'difficult_parts'       => 'nullable|string|max:500',
            'most_helpful_activity' => 'nullable|string|max:500',
            'rating'                => 'nullable|integer|min:1|max:5',
        ]);

        $module = LearningPathModule::where('id_learning_path', $pathId)->findOrFail($moduleId);
        $userId = Auth::id();

        UserReflection::updateOrCreate(
            ['id_user' => $userId, 'id_module' => $moduleId],
            [...$request->only(['understood_concepts', 'difficult_parts', 'most_helpful_activity', 'rating']), 'is_synced' => true]
        );

        $this->completeModule($pathId, $moduleId, $userId);

        $nextModule = $this->getAdjacentModule($pathId, $module->order_number, 'next');

        // Jika ini modul terakhir, selesaikan learning path
        if (!$nextModule) {
            $this->completeLearningPath($pathId, $userId);
        }

        $newBadges   = $this->checkAndAwardBadges($userId, $pathId);
        $totalPoints = $this->getPathTotalPoints($pathId, $userId);

        return response()->json([
            'success'      => true,
            'next_module'  => $nextModule,
            'total_points' => $totalPoints,
            'new_badges'   => $newBadges,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HALAMAN COMPLETION
    // ═══════════════════════════════════════════════════════════════════════

    public function completion(int $pathId)
    {
        $path     = LearningPath::findOrFail($pathId);
        $userId   = Auth::id();

        $progress = UserLearningPathProgress::where('id_user', $userId)
            ->where('id_learning_path', $pathId)
            ->firstOrFail();

        $badges = UserBadge::where('id_user', $userId)
            ->with('badge')
            ->latest('earned_at')
            ->get()
            ->map(fn($ub) => [
                'name'        => $ub->badge->name,
                'description' => $ub->badge->description,
                'image_path'  => $ub->badge->image_path,
                'earned_at'   => $ub->earned_at->toIso8601String(),
            ]);

        return Inertia::render('LearningPath/Completion', [
            'path' => [
                'id_learning_path' => $path->id_learning_path,
                'title'            => $path->title,
                'grade'            => $path->grade,
            ],
            'progress' => [
                'pre_test_score'      => $progress->pre_test_score,
                'post_test_score'     => $progress->post_test_score,
                'score_improvement'   => $progress->score_improvement,
                'progress_percentage' => $progress->progress_percentage,
                'completed_at'        => $progress->completed_at?->toIso8601String(),
            ],
            'total_points' => $this->getPathTotalPoints($pathId, $userId),
            'badges'       => $badges,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    private function formatPathCard(LearningPath $path): array
    {
        $progress = Auth::check()
            ? UserLearningPathProgress::where('id_user', Auth::id())
                ->where('id_learning_path', $path->id_learning_path)
                ->first()
            : null;

        return [
            'id_learning_path'  => $path->id_learning_path,
            'title'             => $path->title,
            'description'       => $path->description,
            'grade'             => $path->grade,
            'category'          => $path->category,
            'thumbnail'         => $path->thumbnail ? Storage::url($path->thumbnail) : null,
            'estimated_minutes' => $path->estimated_minutes,
            'modules_count'     => $path->modules_count,
            'progress'          => $progress ? [
                'status'              => $progress->status,
                'progress_percentage' => $progress->progress_percentage,
            ] : null,
        ];
    }

    private function formatPathDetail(LearningPath $path): array
    {
        return [
            'id_learning_path'  => $path->id_learning_path,
            'title'             => $path->title,
            'description'       => $path->description,
            'grade'             => $path->grade,
            'category'          => $path->category,
            'thumbnail'         => $path->thumbnail ? Storage::url($path->thumbnail) : null,
            'estimated_minutes' => $path->estimated_minutes,
            'modules_count'     => $path->modules_count,
        ];
    }

    private function formatModuleItem(LearningPathModule $module): array
    {
        $progress = Auth::check()
            ? UserModuleProgress::where('id_user', Auth::id())
                ->where('id_module', $module->id_module)
                ->first()
            : null;

        return [
            'id_module'    => $module->id_module,
            'title'        => $module->title,
            'type'         => $module->type,
            'order_number' => $module->order_number,
            'is_required'  => $module->is_required,
            'status'       => $progress?->status ?? UserModuleProgress::STATUS_NOT_STARTED,
        ];
    }

    private function getModuleContent(LearningPathModule $module): array
    {
        return match ($module->type) {
            LearningPathModule::TYPE_PRE_TEST,
            LearningPathModule::TYPE_POST_TEST  => $this->getTestContent($module),
            LearningPathModule::TYPE_MATERIAL   => $this->getMaterialContent($module),
            LearningPathModule::TYPE_REFLECTION => $this->getReflectionContent($module),
            default                             => [],
        };
    }

    private function getTestContent(LearningPathModule $module): array
    {
        $userId = Auth::id();

        $questions = ModuleQuestion::where('id_module', $module->id_module)
            ->with(['question.questionType', 'question.questionOptions', 'question.questionImages'])
            ->orderBy('order_number')
            ->get()
            ->map(function ($mq) {
                $q = $mq->question;
                $options = null;

                if ($q->questionType->question_type === 'pilihan_ganda') {
                    $options = $q->questionOptions
                        ->map(fn($opt) => [
                            'id_question_option' => $opt->id_question_option,
                            'option_text'        => $opt->option_text,
                        ])
                        ->shuffle()
                        ->values();
                }

                return [
                    'id_question'     => $q->id_question,
                    'title'           => $q->title,
                    'question'        => $q->question,
                    'question_type'   => $q->questionType->question_type,
                    'points'          => $q->points,
                    'question_images' => $q->questionImages->map(
                        fn($img) => str_starts_with($img->image_path, 'http')
                            ? $img->image_path
                            : Storage::url($img->image_path)
                    )->toArray(),
                    'options' => $options,
                ];
            });

        // Cek apakah sudah pernah submit (pakai user_answers tabel existing)
        $alreadySubmitted = $userId
            ? UserAnswer::whereIn('id_question', $questions->pluck('id_question'))
                ->where('id_user', $userId)
                ->exists()
            : false;

        return [
            'questions'         => $questions,
            'already_submitted' => $alreadySubmitted,
        ];
    }

    private function getMaterialContent(LearningPathModule $module): array
    {
        $materials = LearningMaterial::where('id_module', $module->id_module)
            ->orderBy('order_number')
            ->get()
            ->map(fn($m) => [
                'id_material'  => $m->id_material,
                'title'        => $m->title,
                'content_type' => $m->content_type,
                'content'      => $m->content,
                'file_url'     => $m->file_url,
                'order_number' => $m->order_number,
            ]);

        return ['materials' => $materials];
    }

    private function getReflectionContent(LearningPathModule $module): array
    {
        $existing = Auth::check()
            ? UserReflection::where('id_user', Auth::id())
                ->where('id_module', $module->id_module)
                ->first()
            : null;

        return [
            'existing_reflection' => $existing ? [
                'understood_concepts'   => $existing->understood_concepts,
                'difficult_parts'       => $existing->difficult_parts,
                'most_helpful_activity' => $existing->most_helpful_activity,
                'rating'                => $existing->rating,
            ] : null,
        ];
    }

    private function getUserPathProgress(int $pathId): ?array
    {
        if (!Auth::check()) return null;

        $progress = UserLearningPathProgress::where('id_user', Auth::id())
            ->where('id_learning_path', $pathId)
            ->first();

        if (!$progress) return null;

        return [
            'status'              => $progress->status,
            'progress_percentage' => $progress->progress_percentage,
            'pre_test_score'      => $progress->pre_test_score,
            'post_test_score'     => $progress->post_test_score,
            'started_at'          => $progress->started_at?->toIso8601String(),
            'completed_at'        => $progress->completed_at?->toIso8601String(),
        ];
    }

    private function getAllModulesWithProgress(int $pathId): array
    {
        return LearningPathModule::where('id_learning_path', $pathId)
            ->orderBy('order_number')
            ->get()
            ->map(fn($m) => $this->formatModuleItem($m))
            ->toArray();
    }

    private function getAdjacentModule(int $pathId, int $currentOrder, string $direction): ?array
    {
        $query = LearningPathModule::where('id_learning_path', $pathId);

        $module = $direction === 'next'
            ? $query->where('order_number', '>', $currentOrder)->orderBy('order_number')->first()
            : $query->where('order_number', '<', $currentOrder)->orderByDesc('order_number')->first();

        return $module
            ? ['id_module' => $module->id_module, 'type' => $module->type, 'title' => $module->title]
            : null;
    }

    private function completeModule(int $pathId, int $moduleId, int $userId): void
    {
        UserModuleProgress::updateOrCreate(
            ['id_user' => $userId, 'id_module' => $moduleId],
            ['status' => UserModuleProgress::STATUS_COMPLETED, 'completed_at' => now(), 'is_synced' => true]
        );

        // Hitung ulang progress_percentage di learning path
        $moduleIds        = LearningPathModule::where('id_learning_path', $pathId)->pluck('id_module');
        $totalModules     = $moduleIds->count();
        $completedModules = UserModuleProgress::where('id_user', $userId)
            ->whereIn('id_module', $moduleIds)
            ->where('status', UserModuleProgress::STATUS_COMPLETED)
            ->count();

        $percentage = $totalModules > 0 ? round(($completedModules / $totalModules) * 100) : 0;

        UserLearningPathProgress::updateOrCreate(
            ['id_user' => $userId, 'id_learning_path' => $pathId],
            [
                'status'              => $percentage >= 100
                    ? UserLearningPathProgress::STATUS_COMPLETED
                    : UserLearningPathProgress::STATUS_IN_PROGRESS,
                'progress_percentage' => $percentage,
                'synced_at'           => now(),
            ]
        );
    }

    private function completeLearningPath(int $pathId, int $userId): void
    {
        UserLearningPathProgress::where('id_user', $userId)
            ->where('id_learning_path', $pathId)
            ->update(['status' => UserLearningPathProgress::STATUS_COMPLETED, 'completed_at' => now()]);
    }

    private function getPathTotalPoints(int $pathId, int $userId): int
    {
        $questionIds = ModuleQuestion::whereIn(
            'id_module',
            LearningPathModule::where('id_learning_path', $pathId)->pluck('id_module')
        )->pluck('id_question');

        return (int) UserPoint::where('id_user', $userId)
            ->whereIn('id_question', $questionIds)
            ->sum('points_earned');
    }

    private function checkAndAwardBadges(int $userId, int $pathId): array
    {
        $newBadges = [];

        Badge::all()->each(function (Badge $badge) use ($userId, $pathId, &$newBadges) {
            if (UserBadge::where('id_user', $userId)->where('id_badge', $badge->id_badge)->exists()) {
                return; // sudah punya
            }

            $earned = match ($badge->criteria_type) {
                Badge::CRITERIA_COMPLETE_PATH => UserLearningPathProgress::where('id_user', $userId)
                    ->where('status', UserLearningPathProgress::STATUS_COMPLETED)
                    ->count() >= $badge->criteria_value,

                Badge::CRITERIA_SCORE_ABOVE   => UserLearningPathProgress::where('id_user', $userId)
                    ->where('id_learning_path', $pathId)
                    ->where('post_test_score', '>=', $badge->criteria_value)
                    ->exists(),

                Badge::CRITERIA_PERFECT_SCORE => UserLearningPathProgress::where('id_user', $userId)
                    ->where('id_learning_path', $pathId)
                    ->where('post_test_score', 100)
                    ->exists(),

                default => false,
            };

            if ($earned) {
                UserBadge::create(['id_user' => $userId, 'id_badge' => $badge->id_badge, 'earned_at' => now()]);
                $newBadges[] = ['name' => $badge->name, 'image_path' => $badge->image_path, 'description' => $badge->description];
            }
        });

        return $newBadges;
    }

    private function guardModuleAccess(int $pathId, LearningPathModule $module): void
    {
        if (!$module->is_required) return;

        $prevRequired = LearningPathModule::where('id_learning_path', $pathId)
            ->where('order_number', '<', $module->order_number)
            ->where('is_required', true)
            ->orderByDesc('order_number')
            ->first();

        if (!$prevRequired) return;

        $prevDone = UserModuleProgress::where('id_user', Auth::id())
            ->where('id_module', $prevRequired->id_module)
            ->where('status', UserModuleProgress::STATUS_COMPLETED)
            ->exists();

        if (!$prevDone) {
            abort(403, 'Selesaikan modul sebelumnya terlebih dahulu.');
        }
    }

    private function resolveAnswer($question, $submitted): array
    {
        if ($question->questionType->question_type === 'pilihan_ganda') {
            $option = $question->questionOptions()->where('id_question_option', $submitted)->first();
            if ($option) {
                return [$option->is_correct, $option->option_text];
            }
            return [false, $submitted];
        }

        $isCorrect = $this->validateAnswer($submitted, $question->correct_answer);
        return [$isCorrect, $submitted];
    }

    private function validateAnswer(string $userAnswer, string $correctPattern): bool
    {
        if (preg_match('/^\/.*\/[a-z]*$/i', $correctPattern)) {
            return preg_match($correctPattern, trim($userAnswer)) === 1;
        }

        return strtolower(preg_replace('/\s+/', ' ', trim($userAnswer)))
            === strtolower(preg_replace('/\s+/', ' ', trim($correctPattern)));
    }
}
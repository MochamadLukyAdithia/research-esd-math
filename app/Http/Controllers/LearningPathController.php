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
    //  INDEX — Tampil berdasarkan KELAS
    // ═══════════════════════════════════════════════════════════════════════

    public function index()
    {
        // Ambil semua grade yang punya learning path published
        $grades = LearningPath::published()
            ->distinct()
            ->orderBy('grade')
            ->pluck('grade');

        // Per grade: hitung modul, hitung progress user
        $gradeData = $grades->map(function ($grade) {
            $paths = LearningPath::published()
                ->where('grade', $grade)
                ->orderBy('order_number')
                ->get();

            $totalModules     = $paths->count();
            $completedModules = 0;
            $inProgressModules= 0;

            if (Auth::check()) {
                foreach ($paths as $path) {
                    $progress = UserLearningPathProgress::where('id_user', Auth::id())
                        ->where('id_learning_path', $path->id_learning_path)
                        ->first();

                    if ($progress?->status === 'completed')   $completedModules++;
                    if ($progress?->status === 'in_progress') $inProgressModules++;
                }
            }

            // Modul pertama yang belum selesai (untuk tombol "Lanjut")
            $nextPath = null;
            if (Auth::check()) {
                foreach ($paths as $path) {
                    $progress = UserLearningPathProgress::where('id_user', Auth::id())
                        ->where('id_learning_path', $path->id_learning_path)
                        ->first();
                    if (!$progress || $progress->status !== 'completed') {
                        $nextPath = $path->id_learning_path;
                        break;
                    }
                }
            }

            return [
                'grade'             => $grade,
                'label'             => $this->gradeLabel($grade),
                'level'             => $grade <= 9 ? 'SMP' : 'SMA',
                'total_modules'     => $totalModules,
                'completed_modules' => $completedModules,
                'in_progress'       => $inProgressModules,
                'progress_pct'      => $totalModules > 0
                    ? round(($completedModules / $totalModules) * 100) : 0,
                'next_path_id'      => $nextPath,
                // Preview kategori topik
                'topics'            => $paths->pluck('category')->unique()->take(3)->values(),
            ];
        });

        return Inertia::render('LearningPath/Index', [
            'gradeData' => $gradeData,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  GRADE PAGE — Daftar modul dalam satu kelas
    // ═══════════════════════════════════════════════════════════════════════

    public function grade(int $grade)
    {
        $paths = LearningPath::published()
            ->where('grade', $grade)
            ->withCount('modules')
            ->orderBy('order_number')
            ->get();

        if ($paths->isEmpty()) {
            abort(404);
        }

        $modules = $paths->map(function ($path, $index) use ($paths) {
            $progress = null;
            $isLocked = false;

            if (Auth::check()) {
                $progress = UserLearningPathProgress::where('id_user', Auth::id())
                    ->where('id_learning_path', $path->id_learning_path)
                    ->first();

                // Kunci jika modul sebelumnya belum selesai
                if ($index > 0) {
                    $prevPath     = $paths[$index - 1];
                    $prevProgress = UserLearningPathProgress::where('id_user', Auth::id())
                        ->where('id_learning_path', $prevPath->id_learning_path)
                        ->first();
                    $isLocked = !$prevProgress || $prevProgress->status !== 'completed';
                }
            }

            // Ambil steps modul (pre_test, KB1, KB2, dst, post_test, reflection)
            $steps = LearningPathModule::where('id_learning_path', $path->id_learning_path)
                ->orderBy('order_number')
                ->get()
                ->map(fn($m) => [
                    'id_module'    => $m->id_module,
                    'title'        => $m->title,
                    'type'         => $m->type,
                    'order_number' => $m->order_number,
                ]);

            return [
                'id_learning_path'  => $path->id_learning_path,
                'title'             => $path->title,
                'description'       => $path->description,
                'category'          => $path->category,
                'estimated_minutes' => $path->estimated_minutes,
                'thumbnail'         => $path->thumbnail ? Storage::url($path->thumbnail) : null,
                'order_number'      => $path->order_number,
                'modules_count'     => $path->modules_count,
                'steps'             => $steps,
                'is_locked'         => $isLocked,
                'progress'          => $progress ? [
                    'status'              => $progress->status,
                    'progress_percentage' => $progress->progress_percentage,
                    'pre_test_score'      => $progress->pre_test_score,
                    'post_test_score'     => $progress->post_test_score,
                ] : null,
            ];
        });

        return Inertia::render('LearningPath/Grade', [
            'grade'   => $grade,
            'label'   => $this->gradeLabel($grade),
            'level'   => $grade <= 9 ? 'SMP' : 'SMA',
            'modules' => $modules,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SHOW — Detail modul sebelum mulai (tampil stepper alur belajar)
    // ═══════════════════════════════════════════════════════════════════════

    public function show(int $id)
    {
        $path = LearningPath::published()->findOrFail($id);

        // Ambil semua steps dengan status per user
        $steps = LearningPathModule::where('id_learning_path', $id)
            ->orderBy('order_number')
            ->get()
            ->map(function ($m) {
                $moduleProgress = null;
                if (Auth::check()) {
                    $moduleProgress = UserModuleProgress::where('id_user', Auth::id())
                        ->where('id_module', $m->id_module)
                        ->first();
                }

                return [
                    'id_module'    => $m->id_module,
                    'title'        => $m->title,
                    'type'         => $m->type,
                    'order_number' => $m->order_number,
                    'is_required'  => $m->is_required,
                    'status'       => $moduleProgress?->status ?? 'not_started',
                ];
            });

        $progress = null;
        if (Auth::check()) {
            $progress = UserLearningPathProgress::where('id_user', Auth::id())
                ->where('id_learning_path', $id)
                ->first();
        }

        // Modul lain dalam kelas yang sama (untuk navigasi antar modul)
        $siblingModules = LearningPath::published()
            ->where('grade', $path->grade)
            ->where('id_learning_path', '!=', $id)
            ->orderBy('order_number')
            ->get(['id_learning_path', 'title', 'order_number']);

        return Inertia::render('LearningPath/Show', [
            'path' => [
                'id_learning_path'  => $path->id_learning_path,
                'title'             => $path->title,
                'description'       => $path->description,
                'grade'             => $path->grade,
                'grade_label'       => $this->gradeLabel($path->grade),
                'category'          => $path->category,
                'thumbnail'         => $path->thumbnail ? Storage::url($path->thumbnail) : null,
                'estimated_minutes' => $path->estimated_minutes,
                'capaian_pembelajaran' => $path->capaian_pembelajaran,
                'kompetensi_dasar'     => $path->kompetensi_dasar,
                'metode_penilaian'     => $path->metode_penilaian,
                'sumber_belajar'       => $path->sumber_belajar,
                'order_number'      => $path->order_number,
                 'modules_count'     => LearningPathModule::where('id_learning_path', $path->id_learning_path)->count(), // ← tambah ini
            ],
            'modules'    => $steps,
            'progress' => $progress ? [
                'status'              => $progress->status,
                'progress_percentage' => $progress->progress_percentage,
                'pre_test_score'      => $progress->pre_test_score,
                'post_test_score'     => $progress->post_test_score,
            ] : null,
            'sibling_modules' => $siblingModules,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  START — Mulai learning path
    // ═══════════════════════════════════════════════════════════════════════

    public function start(int $id)
    {
        $path = LearningPath::published()->findOrFail($id);

        // Cek apakah modul sebelumnya sudah selesai
        $prevPath = LearningPath::published()
            ->where('grade', $path->grade)
            ->where('order_number', '<', $path->order_number)
            ->orderByDesc('order_number')
            ->first();

        if ($prevPath) {
            $prevProgress = UserLearningPathProgress::where('id_user', Auth::id())
                ->where('id_learning_path', $prevPath->id_learning_path)
                ->first();

            if (!$prevProgress || $prevProgress->status !== 'completed') {
                return response()->json([
                    'error' => 'Selesaikan modul sebelumnya terlebih dahulu.',
                ], 403);
            }
        }

        $progress = UserLearningPathProgress::firstOrCreate(
            ['id_user' => Auth::id(), 'id_learning_path' => $id],
            [
                'status'              => 'in_progress',
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
    //  MODULE — Tampilkan halaman modul (pre_test/material/post_test/reflection)
    // ═══════════════════════════════════════════════════════════════════════

    public function module(int $pathId, int $moduleId)
    {
        $path   = LearningPath::published()->findOrFail($pathId);
        $module = LearningPathModule::where('id_learning_path', $pathId)->findOrFail($moduleId);

        // Guard: modul sebelumnya harus selesai
        $this->guardModuleAccess($pathId, $module);

        UserModuleProgress::firstOrCreate(
            ['id_user' => Auth::id(), 'id_module' => $moduleId],
            ['status' => 'in_progress']
        );

        // Semua steps untuk sidebar
        $allModules = LearningPathModule::where('id_learning_path', $pathId)
            ->orderBy('order_number')
            ->get()
            ->map(function ($m) {
                $mp = Auth::check()
                    ? UserModuleProgress::where('id_user', Auth::id())->where('id_module', $m->id_module)->first()
                    : null;
                return [
                    'id_module'    => $m->id_module,
                    'title'        => $m->title,
                    'type'         => $m->type,
                    'order_number' => $m->order_number,
                    'is_required'  => $m->is_required,
                    'status'       => $mp?->status ?? 'not_started',
                ];
            });

        return Inertia::render('LearningPath/Module', [
            'path' => [
                'id_learning_path' => $path->id_learning_path,
                'title'            => $path->title,
                'grade'            => $path->grade,
                'grade_label'      => $this->gradeLabel($path->grade),
            ],
            'module'      => array_merge($this->formatModuleItem($module), $this->getModuleContent($module)),
            'all_modules' => $allModules,
            'progress'    => $this->getUserPathProgress($pathId),
            'next_module' => $this->getAdjacentModule($pathId, $module->order_number, 'next'),
            'prev_module' => $this->getAdjacentModule($pathId, $module->order_number, 'prev'),
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SUBMIT ANSWER
    // ═══════════════════════════════════════════════════════════════════════

    public function submitAnswer(Request $request, int $pathId, int $moduleId)
    {
        $request->validate(['answers' => 'required|array']);

        $module    = LearningPathModule::where('id_learning_path', $pathId)->findOrFail($moduleId);
        $userId    = Auth::id();
        $mqList    = ModuleQuestion::where('id_module', $moduleId)
            ->with(['question.questionOptions', 'question.questionType'])
            ->orderBy('order_number')
            ->get();

        $totalPoints = 0;
        $maxPoints   = 0;
        $results     = [];

        // ✅ Tambah $module dan $pathId ke use()
DB::transaction(function () use ($mqList, $request, $userId, $module, $pathId, &$totalPoints, &$maxPoints, &$results) {
    foreach ($mqList as $mq) {
        $question  = $mq->question;
        $submitted = $request->answers[$question->id_question] ?? null;
        if ($submitted === null) continue;

        $maxPoints += $question->points;
        [$isCorrect, $answerText] = $this->resolveAnswer($question, $submitted);

        UserAnswer::create([
            'id_question' => $question->id_question,
            'id_user'     => $userId,
            'answer'      => $answerText,
            'is_correct'  => $isCorrect,
            'answered_at' => now(),
        ]);

        if ($isCorrect) {
            $alreadyPointed = UserPoint::where('id_user', $userId)
                ->where('id_question', $question->id_question)
                ->where('source', $module->type)
                ->exists();

            if (!$alreadyPointed) {
                UserPoint::create([
                    'id_user'          => $userId,
                    'id_question'      => $question->id_question,
                    'points_earned'    => $question->points,
                    'source'           => $module->type,
                    'id_learning_path' => $pathId,
                ]);
                $totalPoints += $question->points;
            }
        }

        $results[] = [
            'id_question'    => $question->id_question,
            'is_correct'     => $isCorrect,
            'answer'         => $answerText,
            'correct_answer' => $question->correct_answer,
            'options'        => $question->questionOptions->map(fn($o) => [
                'id_question_option' => $o->id_question_option,
                'option_text'        => $o->option_text,
                'is_correct'         => $o->is_correct,
            ]),
        ];
    }
});

        $score = $maxPoints > 0 ? round(($totalPoints / $maxPoints) * 100) : 0;

        $pathProgress = UserLearningPathProgress::where('id_user', $userId)
            ->where('id_learning_path', $pathId)->first();

        if ($pathProgress) {
            if ($module->type === 'pre_test')  $pathProgress->update(['pre_test_score'  => $score]);
            if ($module->type === 'post_test') $pathProgress->update(['post_test_score' => $score]);
        }

        $this->completeModule($pathId, $moduleId, $userId);

        return response()->json([
            'score'       => $score,
            'total_points'=> $totalPoints,
            'max_points'  => $maxPoints,
            'results'     => $results,
            'next_module' => $this->getAdjacentModule($pathId, $module->order_number, 'next'),
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  COMPLETE MATERIAL
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
    //  SUBMIT REFLECTION
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
        if (!$nextModule) {
            $this->completeLearningPath($pathId, $userId);
        }

        return response()->json([
            'success'      => true,
            'next_module'  => $nextModule,
            'total_points' => $this->getPathTotalPoints($pathId, $userId),
            'new_badges'   => $this->checkAndAwardBadges($userId, $pathId),
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  COMPLETION PAGE
    // ═══════════════════════════════════════════════════════════════════════

    public function completion(int $pathId)
    {
        $path     = LearningPath::findOrFail($pathId);
        $userId   = Auth::id();
        $progress = UserLearningPathProgress::where('id_user', $userId)
            ->where('id_learning_path', $pathId)->firstOrFail();

        // Cek apakah ada modul berikutnya dalam kelas
        $nextModuleInGrade = LearningPath::published()
            ->where('grade', $path->grade)
            ->where('order_number', '>', $path->order_number)
            ->orderBy('order_number')
            ->first();

        $badges = UserBadge::where('id_user', $userId)->with('badge')->latest('earned_at')->get()
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
                'description'      => $path->description,
                'grade'            => $path->grade,
                'category'         => $path->category,
            ],
            'progress' => [
                'status'              => $progress->status,
                'progress_percentage' => $progress->progress_percentage,
                'pre_test_score'      => $progress->pre_test_score,
                'post_test_score'     => $progress->post_test_score,
                'started_at'          => $progress->started_at?->toIso8601String(),
                'completed_at'        => $progress->completed_at?->toIso8601String(),
            ],
            'total_points'       => $this->getPathTotalPoints($pathId, $userId),
            'badges'             => $badges,
            'next_module_in_grade' => $nextModuleInGrade ? [
                'id_learning_path' => $nextModuleInGrade->id_learning_path,
                'title'            => $nextModuleInGrade->title,
            ] : null,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    private function gradeLabel(int $grade): string
    {
        return "Kelas {$grade}";
    }

    private function formatModuleItem(LearningPathModule $module): array
    {
        $progress = Auth::check()
            ? UserModuleProgress::where('id_user', Auth::id())->where('id_module', $module->id_module)->first()
            : null;

        return [
            'id_module'    => $module->id_module,
            'title'        => $module->title,
            'type'         => $module->type,
            'order_number' => $module->order_number,
            'is_required'  => $module->is_required,
            'status'       => $progress?->status ?? 'not_started',
        ];
    }

    private function getModuleContent(LearningPathModule $module): array
    {
        return match ($module->type) {
            'pre_test', 'post_test' => $this->getTestContent($module),
            'material', 'activity'  => $this->getMaterialContent($module),
            'reflection'            => $this->getReflectionContent($module),
            default                 => [],
        };
    }

    private function getTestContent(LearningPathModule $module): array
    {
        $userId    = Auth::id();
 
        // ── Bangun daftar soal ─────────────────────────────────────────────────
        $questions = ModuleQuestion::where('id_module', $module->id_module)
            ->with(['question.questionType', 'question.questionOptions', 'question.questionImages'])
            ->orderBy('order_number')
            ->get()
            ->map(function ($mq) {
                $q = $mq->question;
                $options = null;
                if ($q->questionType->question_type === 'pilihan_ganda') {
                    $options = $q->questionOptions->map(fn($opt) => [
                        'id_question_option' => $opt->id_question_option,
                        'option_text'        => $opt->option_text,
                    ])->shuffle()->values();
                }
                return [
                    'id_question'     => $q->id_question,
                    'title'           => $q->title,
                    'question'        => $q->question,
                    'question_type'   => $q->questionType->question_type,
                    'points'          => $q->points,
                    'question_images' => $q->questionImages->map(
                        fn($img) => str_starts_with($img->image_path, 'http')
                            ? $img->image_path : Storage::url($img->image_path)
                    )->toArray(),
                    'options'          => $options,
                    'correct_answer'   => $q->correct_answer, // ← dibutuhkan untuk review
                ];
            });
 
        // ── Cek apakah sudah pernah dikerjakan ────────────────────────────────
        $alreadySubmitted = $userId
            ? UserModuleProgress::where('id_user', $userId)
                ->where('id_module', $module->id_module)
                ->where('status', 'completed')
                ->exists()
            : false;
 
        // ── Ambil jawaban & skor sebelumnya jika sudah dikerjakan ──────────────
        $previousScore   = null;
        $previousAnswers = [];
 
        if ($alreadySubmitted && $userId) {
            // Ambil jawaban user untuk soal-soal di modul ini
            $questionIds = $questions->pluck('id_question')->toArray();
 
            $userAnswers = UserAnswer::where('id_user', $userId)
                ->whereIn('id_question', $questionIds)
                ->orderBy('answered_at', 'desc') // ambil jawaban terbaru per soal
                ->get()
                ->unique('id_question'); // deduplicate per soal
 
            $totalPoints = 0;
            $maxPoints   = 0;
 
            foreach ($questions as $q) {
                $ua = $userAnswers->firstWhere('id_question', $q['id_question']);
                if (!$ua) continue;
 
                $maxPoints   += $q['points'];
                $isCorrect    = (bool) $ua->is_correct;
                if ($isCorrect) $totalPoints += $q['points'];
 
                // Resolve jawaban benar (teks) untuk pilihan ganda
                $correctAnswerText = $q['correct_answer'] ?? '';
 
                $previousAnswers[] = [
                    'id_question'    => $q['id_question'],
                    'is_correct'     => $isCorrect,
                    'answer'         => $ua->answer,
                    'correct_answer' => $correctAnswerText,
                ];
            }
 
            $previousScore = $maxPoints > 0
                ? round(($totalPoints / $maxPoints) * 100)
                : 0;
 
            // Ambil skor dari path progress jika ada (lebih akurat)
            $pathProgress = UserLearningPathProgress::where('id_user', $userId)
                ->where('id_learning_path', $module->id_learning_path)
                ->first();
 
            if ($pathProgress) {
                if ($module->type === 'pre_test'  && $pathProgress->pre_test_score  !== null) {
                    $previousScore = $pathProgress->pre_test_score;
                }
                if ($module->type === 'post_test' && $pathProgress->post_test_score !== null) {
                    $previousScore = $pathProgress->post_test_score;
                }
            }
        }
 
        // Hapus correct_answer dari questions sebelum dikirim ke frontend
        // (agar tidak terlihat sebelum submit; review akan pakai previous_answers)
        $questionsForFrontend = $questions->map(function ($q) use ($alreadySubmitted) {
            if (!$alreadySubmitted) {
                unset($q['correct_answer']);
            }
            return $q;
        });
 
        return [
            'questions'        => $questionsForFrontend,
            'already_submitted'=> $alreadySubmitted,
            'previous_score'   => $previousScore,
            'previous_answers' => $previousAnswers,
        ];
    }
    private function getMaterialContent(LearningPathModule $module): array
    {
        $materials = LearningMaterial::where('id_module', $module->id_module)
            ->orderBy('order_number')->get()
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
            ? UserReflection::where('id_user', Auth::id())->where('id_module', $module->id_module)->first()
            : null;
        return ['existing_reflection' => $existing ? [
            'understood_concepts'   => $existing->understood_concepts,
            'difficult_parts'       => $existing->difficult_parts,
            'most_helpful_activity' => $existing->most_helpful_activity,
            'rating'                => $existing->rating,
        ] : null];
    }

    private function getUserPathProgress(int $pathId): ?array
    {
        if (!Auth::check()) return null;
        $p = UserLearningPathProgress::where('id_user', Auth::id())
            ->where('id_learning_path', $pathId)->first();
        if (!$p) return null;
        return [
            'status'              => $p->status,
            'progress_percentage' => $p->progress_percentage,
            'pre_test_score'      => $p->pre_test_score,
            'post_test_score'     => $p->post_test_score,
        ];
    }

    private function getAdjacentModule(int $pathId, int $currentOrder, string $direction): ?array
    {
        $query = LearningPathModule::where('id_learning_path', $pathId);
        $module = $direction === 'next'
            ? $query->where('order_number', '>', $currentOrder)->orderBy('order_number')->first()
            : $query->where('order_number', '<', $currentOrder)->orderByDesc('order_number')->first();
        return $module ? ['id_module' => $module->id_module, 'type' => $module->type, 'title' => $module->title] : null;
    }

    private function completeModule(int $pathId, int $moduleId, int $userId): void
    {
        UserModuleProgress::updateOrCreate(
            ['id_user' => $userId, 'id_module' => $moduleId],
            ['status' => 'completed', 'completed_at' => now(), 'is_synced' => true]
        );

        $moduleIds        = LearningPathModule::where('id_learning_path', $pathId)->pluck('id_module');
        $total            = $moduleIds->count();
        $completed        = UserModuleProgress::where('id_user', $userId)
            ->whereIn('id_module', $moduleIds)->where('status', 'completed')->count();
        $pct              = $total > 0 ? round(($completed / $total) * 100) : 0;

        UserLearningPathProgress::updateOrCreate(
            ['id_user' => $userId, 'id_learning_path' => $pathId],
            [
                'status'              => $pct >= 100 ? 'completed' : 'in_progress',
                'progress_percentage' => $pct,
                'synced_at'           => now(),
            ]
        );
    }

    private function completeLearningPath(int $pathId, int $userId): void
    {
        UserLearningPathProgress::where('id_user', $userId)->where('id_learning_path', $pathId)
            ->update(['status' => 'completed', 'completed_at' => now()]);
    }

private function getPathTotalPoints(int $pathId, int $userId): int
{
    return (int) UserPoint::where('id_user', $userId)
        ->where('id_learning_path', $pathId)
        ->sum('points_earned');
}

    private function checkAndAwardBadges(int $userId, int $pathId): array
    {
        $newBadges = [];
        Badge::all()->each(function (Badge $badge) use ($userId, $pathId, &$newBadges) {
            if (UserBadge::where('id_user', $userId)->where('id_badge', $badge->id_badge)->exists()) return;
            $earned = match ($badge->criteria_type) {
                'complete_path' => UserLearningPathProgress::where('id_user', $userId)
                    ->where('status', 'completed')->count() >= $badge->criteria_value,
                'score_above'   => UserLearningPathProgress::where('id_user', $userId)
                    ->where('id_learning_path', $pathId)->where('post_test_score', '>=', $badge->criteria_value)->exists(),
                'perfect_score' => UserLearningPathProgress::where('id_user', $userId)
                    ->where('id_learning_path', $pathId)->where('post_test_score', 100)->exists(),
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
            ->where('order_number', '<', $module->order_number)->where('is_required', true)
            ->orderByDesc('order_number')->first();
        if (!$prevRequired) return;
        $done = UserModuleProgress::where('id_user', Auth::id())
            ->where('id_module', $prevRequired->id_module)->where('status', 'completed')->exists();
        if (!$done) abort(403, 'Selesaikan langkah sebelumnya terlebih dahulu.');
    }

    private function resolveAnswer($question, $submitted): array
    {
        if ($question->questionType->question_type === 'pilihan_ganda') {
            $option = $question->questionOptions()->where('id_question_option', $submitted)->first();
            if ($option) return [$option->is_correct, $option->option_text];
            return [false, $submitted];
        }
        $isCorrect = strtolower(preg_replace('/\s+/', ' ', trim($submitted)))
            === strtolower(preg_replace('/\s+/', ' ', trim($question->correct_answer ?? '')));
        return [$isCorrect, $submitted];
    }
}
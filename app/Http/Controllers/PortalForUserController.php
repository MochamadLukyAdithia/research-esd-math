<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Tag;
use App\Models\UserAnswer;
use App\Models\UserPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
class PortalForUserController extends Controller
{
    const MAX_ATTEMPTS_BEFORE_COOLDOWN = 3;
    const COOLDOWN_DURATION = 30;
    const ATTEMPT_RESET_DURATION = 300;

    public function index()
    {
        $query = Question::with(['tags', 'favoritedBy', 'questionType', 'questionImages']);

        if (Auth::check()) {
            $query->with(['favoritedBy' => function($q) {
                $q->where('users.id_user', Auth::id());
            }]);
        }

        $tasks = $query->get()->map(function ($question) {
            $userAnswer = null;
            if (Auth::check()) {
                $userAnswer = UserAnswer::where('id_question', $question->id_question)
                    ->where('id_user', Auth::id())
                    ->where('is_correct', true)
                    ->first();
            }

            return [
                'id_question' => $question->id_question,
                'title' => $question->title,
                'location_name' => $question->location_name,
                'latitude' => (float) $question->latitude,
                'longitude' => (float) $question->longitude,
                'question_image' => $question->question_image_url,
                'question_images' => $question->questionImages->map(fn($img) =>
                    str_starts_with($img->image_path, 'http')
                        ? $img->image_path
                        : Storage::url($img->image_path)
                )->toArray(),
                'tags' => $question->tags,
                'grade' => $question->grade,
                'points' => $question->points,
                'question_type' => $question->questionType->question_type,
                'is_favorite' => Auth::check()
                    ? $question->favoritedBy->isNotEmpty()
                    : false,
                'is_answered' => $userAnswer ? true : false,
                'created_at' => $question->created_at->toIso8601String(),
                'user_points' => $question->userPoints()->where('id_user', Auth::id())->sum('points_earned'),
            ];
        });

        $allTags = Tag::all(['id_tag', 'tag_name']);

        return Inertia::render('Portal/Index', [
            'tasks' => $tasks,
            'tags' => $allTags,
        ]);
    }

    public function getQuestionDetail($id)
    {
        $question = Question::with(['tags', 'user', 'favoritedBy', 'hints', 'questionType', 'questionOptions', 'questionImages'])
            ->findOrFail($id);

        if (Auth::check()) {
            $question->load(['favoritedBy' => function($q) {
                $q->where('users.id_user', Auth::id());
            }]);
        }

        $userAnswer = null;
        $attemptInfo = null;
        $pointsEarned = null;
        $potentialPoints = null;

        if (Auth::check()) {
            $userAnswer = UserAnswer::where('id_question', $id)
                ->where('id_user', Auth::id())
                ->where('is_correct', true)
                ->first();

            $attemptInfo = $this->getAttemptInfo($id);

            $userPoint = UserPoint::where('id_question', $id)
                ->where('id_user', Auth::id())
                ->first();

            if ($userPoint) {
                $pointsEarned = $userPoint->points_earned;
            } else if (!$userAnswer) {
                $potentialPoints = $question->points;
            }
        }

        $options = null;
        if ($question->questionType->question_type === 'pilihan_ganda') {
            $options = $question->questionOptions->map(function ($opt) {
                return [
                    'id_question_option' => $opt->id_question_option,
                    'option_text' => $opt->option_text,
                ];
            })->shuffle()->values();
        }

        return response()->json([
            'id_question' => $question->id_question,
            'title' => $question->title,
            'question' => $question->question,
            'question_type' => $question->questionType->question_type,
            'location_name' => $question->location_name,
            'latitude' => (float) $question->latitude,
            'longitude' => (float) $question->longitude,
            'question_image' => $question->question_image_url,
            'question_images' => $question->questionImages->map(fn($img) =>
                str_starts_with($img->image_path, 'http')
                    ? $img->image_path
                    : Storage::url($img->image_path)
            )->toArray(),
            'tags' => $question->tags,
            'grade' => $question->grade,
            'points' => $question->points,
            'options' => $options,
            'is_favorite' => Auth::check()
                ? $question->favoritedBy->isNotEmpty()
                : false,
            'is_answered' => $userAnswer ? true : false,
            'created_at' => $question->created_at->toIso8601String(),
            'creator' => [
                'name' => $question->user->name,
                'email' => $question->user->email,
                'avatar' => $question->user->avatar ?? null,
            ],
            'hints' => $question->hints->map(function($hint) {
                return [
                    'id_hint' => $hint->id_hint,
                    'image' => $hint->image,
                    'hint_description' => $hint->hint_description,
                ];
            }),
            'user_answer' => $userAnswer ? [
                'answer' => $userAnswer->answer,
                'is_correct' => true,
                'answered_at' => $userAnswer->answered_at->toIso8601String(),
            ] : null,
            'attempt_info' => $userAnswer ? null : $attemptInfo,
            'points_earned' => $pointsEarned,
            'potential_points' => $userAnswer ? null : $potentialPoints,
        ]);
    }


    public function checkAnswer(Request $request, $id)
    {
        $request->validate([
            'answer' => 'required',
        ]);

        if (!Auth::check()) {
            return response()->json(['error' => 'Anda harus login'], 401);
        }

        $userId = Auth::id();

        $question = Question::with(['questionOptions', 'questionType'])->findOrFail($id);

        $existingCorrectAnswer = UserAnswer::where('id_question', $id)
            ->where('id_user', $userId)
            ->where('is_correct', true)
            ->first();

        if ($existingCorrectAnswer) {
            $pointsEarned = UserPoint::where('id_question', $id)
                ->where('id_user', $userId)
                ->value('points_earned');

            return response()->json([
                'already_answered' => true,
                'is_correct' => true,
                'user_answer' => $existingCorrectAnswer->answer,
                'message' => 'Anda sudah menjawab soal ini dengan benar!',
                'points_earned' => $pointsEarned,
            ]);
        }

        $cooldownCheck = $this->checkCooldown($id, $userId);
        if ($cooldownCheck['is_cooldown']) {
            return response()->json([
                'is_cooldown' => true,
                'cooldown_remaining' => $cooldownCheck['remaining_seconds'],
                'message' => $cooldownCheck['message'],
            ], 429);
        }

        $isCorrect = false;
        $answerText = $request->answer;

        if ($question->questionType->question_type === 'pilihan_ganda') {
            $selectedOption = $question->questionOptions()
                ->where('id_question_option', $request->answer)
                ->first();
            if ($selectedOption) {
                $isCorrect = $selectedOption->is_correct;
                $answerText = $selectedOption->option_text;
            }
        } else {
            $isCorrect = $this->validateAnswer($request->answer, $question->correct_answer);
            $answerText = $request->answer;
        }

        if ($isCorrect) {
            DB::transaction(function () use ($id, $userId, $answerText) {
                UserAnswer::create([
                    'id_question' => $id,
                    'id_user' => $userId,
                    'answer' => $answerText,
                    'is_correct' => true,
                    'answered_at' => now(),
                ]);

            });

            $this->clearAttempts($id, $userId);

            return response()->json([
                'is_correct' => true,
                'user_answer' => $answerText,
                'message' => 'Selamat! Jawaban Anda benar!',
                'points_earned' => $question->points,
                'bonus_message' => null,
            ]);

        } else {
            $attemptInfo = $this->incrementAttempt($id, $userId);
            return response()->json([
                'is_correct' => false,
                'user_answer' => $answerText,
                'message' => 'Jawaban salah. Silakan coba lagi!',
                'attempts_remaining' => $attemptInfo['attempts_remaining'],
                'total_attempts' => $attemptInfo['total_attempts'],
                'is_cooldown' => $attemptInfo['is_cooldown'],
                'cooldown_remaining' => $attemptInfo['cooldown_remaining'] ?? null,
            ]);
        }
    }

    private function getUserStats($userId)
    {
        $totalPoints = UserPoint::getTotalPoints($userId);

        $rank = null;

        $totalAnswered = UserAnswer::where('id_user', $userId)
            ->where('is_correct', true)
            ->count();

        return [
            'total_points' => $totalPoints,
            'rank' => $rank,
            'total_answered' => $totalAnswered,
        ];
    }

    public function getLeaderboard(Request $request)
    {
        $limit = $request->input('limit', 10);

        $leaderboard = UserPoint::select('id_user')
            ->selectRaw('SUM(points_earned) as total_points')
            ->selectRaw('COUNT(DISTINCT id_question) as questions_answered')
            ->with('user:id_user,name,email,avatar')
            ->groupBy('id_user')
            ->orderByDesc('total_points')
            ->limit($limit)
            ->get()
            ->map(function ($item, $index) {
                return [
                    'rank' => $index + 1,
                    'user' => [
                        'id' => $item->user->id_user,
                        'name' => $item->user->name,
                        'email' => $item->user->email,
                        'avatar' => $item->user->avatar,
                    ],
                    'total_points' => $item->total_points,
                    'questions_answered' => $item->questions_answered,
                ];
            });

        return response()->json($leaderboard);
    }

    public function getUserProfile()
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userId = Auth::id();
        $stats = $this->getUserStats($userId);

        $recentActivities = UserPoint::where('id_user', $userId)
            ->with('question:id_question,title')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($point) {
                return [
                    'question_title' => $point->question->title,
                    'points_earned' => $point->points_earned,
                    'earned_at' => $point->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'stats' => $stats,
            'recent_activities' => $recentActivities,
        ]);
    }

    private function checkCooldown($questionId, $userId)
    {
        $cooldownKey = "cooldown:q{$questionId}:u{$userId}";
        $cooldownUntil = Cache::get($cooldownKey);

        if ($cooldownUntil) {
            $remaining = $cooldownUntil - time();
            if ($remaining > 0) {
                return [
                    'is_cooldown' => true,
                    'remaining_seconds' => $remaining,
                    'message' => "Anda harus menunggu {$remaining} detik.",
                ];
            }
        }

        return ['is_cooldown' => false];
    }

    private function incrementAttempt($questionId, $userId)
    {
        $attemptKey = "attempts:q{$questionId}:u{$userId}";
        $attempts = Cache::get($attemptKey, 0) + 1;

        Cache::put($attemptKey, $attempts, self::ATTEMPT_RESET_DURATION);

        $attemptsRemaining = self::MAX_ATTEMPTS_BEFORE_COOLDOWN - $attempts;

        if ($attempts >= self::MAX_ATTEMPTS_BEFORE_COOLDOWN) {
            $cooldownKey = "cooldown:q{$questionId}:u{$userId}";
            $cooldownUntil = time() + self::COOLDOWN_DURATION;
            Cache::put($cooldownKey, $cooldownUntil, self::COOLDOWN_DURATION);

            Cache::forget($attemptKey);

            return [
                'total_attempts' => $attempts,
                'attempts_remaining' => 0,
                'is_cooldown' => true,
                'cooldown_remaining' => self::COOLDOWN_DURATION,
            ];
        }

        return [
            'total_attempts' => $attempts,
            'attempts_remaining' => max(0, $attemptsRemaining),
            'is_cooldown' => false,
        ];
    }

    private function clearAttempts($questionId, $userId)
    {
        $attemptKey = "attempts:q{$questionId}:u{$userId}";
        $cooldownKey = "cooldown:q{$questionId}:u{$userId}";

        Cache::forget($attemptKey);
        Cache::forget($cooldownKey);
    }

    private function getAttemptInfo($questionId)
    {
        if (!Auth::check()) {
            return null;
        }

        $userId = Auth::id();
        $attemptKey = "attempts:q{$questionId}:u{$userId}";
        $cooldownKey = "cooldown:q{$questionId}:u{$userId}";

        $attempts = Cache::get($attemptKey, 0);
        $cooldownUntil = Cache::get($cooldownKey);

        $info = [
            'total_attempts' => $attempts,
            'max_attempts' => self::MAX_ATTEMPTS_BEFORE_COOLDOWN,
            'attempts_remaining' => max(0, self::MAX_ATTEMPTS_BEFORE_COOLDOWN - $attempts),
        ];

        if ($cooldownUntil) {
            $remaining = $cooldownUntil - time();
            if ($remaining > 0) {
                $info['is_cooldown'] = true;
                $info['cooldown_remaining'] = $remaining;
            }
        }

        return $info;
    }

    private function validateAnswer($userAnswer, $correctAnswerPattern)
    {
        if (preg_match('/^\/.*\/[a-z]*$/i', $correctAnswerPattern)) {
            return preg_match($correctAnswerPattern, trim($userAnswer)) === 1;
        }

        $normalizedUser = $this->normalizeAnswer($userAnswer);
        $normalizedCorrect = $this->normalizeAnswer($correctAnswerPattern);
        return $normalizedUser === $normalizedCorrect;
    }

    private function normalizeAnswer($answer)
    {
        $normalized = trim($answer);
        $normalized = strtolower($normalized);
        $normalized = preg_replace('/\s+/', ' ', $normalized);
        return $normalized;
    }

    public function toggleFavorite($questionId)
    {
        if (!Auth::check()) {
            return back()->with('error', 'Anda harus login untuk memfavoritkan soal.');
        }

        $question = Question::findOrFail($questionId);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $isFavorite = $user->favoriteQuestions()->where('favorite_questions.id_question', $questionId)->exists();

        if ($isFavorite) {
            $user->favoriteQuestions()->detach($questionId);
            $message = 'Dihapus dari favorit';
        } else {
            $user->favoriteQuestions()->attach($questionId);
            $message = 'Ditambahkan ke favorit';
        }

        return back()->with('success', $message);
    }
}

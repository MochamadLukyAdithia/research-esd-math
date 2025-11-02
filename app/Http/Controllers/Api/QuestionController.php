<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Tag;
use App\Models\UserAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

use function Illuminate\Log\log;

class QuestionController extends Controller
{
    const MAX_ATTEMPTS_BEFORE_COOLDOWN = 3;
    const COOLDOWN_DURATION = 30;
    const ATTEMPT_RESET_DURATION = 300;

    public function getQuestionDetail($id)
    {
        $question = Question::with(['tags', 'user', 'favoritedBy', 'hints', 'questionOptions', 'questionType'])
            ->findOrFail($id);

        if (Auth::check()) {
            $question->load(['favoritedBy' => function ($q) {
                $q->where('users.id_user', Auth::id());
            }]);
        }

        $userAnswer = null;
        $attemptInfo = null;

        if (Auth::check()) {
            $userAnswer = UserAnswer::where('id_question', $id)
                ->where('id_user', Auth::id())
                ->where('is_correct', true)
                ->first();

            $attemptInfo = $this->getAttemptInfo($id);
        }

        $options = null;
        if ($question->questionType->question_type === 'pilihan_ganda') {
            $options = $question->questionOptions->map(function ($opt) {
                return [
                    'id_question_option' => $opt->id_question_option,
                    'option_text' => $opt->option_text,
                    'is_correct' => $opt->is_correct,
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
            'question_image' => $question->question_image_url ?? null,
            'grade' => $question->grade,
            'tags' => $question->tags,
            'options' => $options,
            'is_favorite' => Auth::check()
                ? $question->favoritedBy->isNotEmpty()
                : false,
            'created_at' => $question->created_at->toIso8601String(),
            'creator' => [
                'name' => $question->user->name,
                'email' => $question->user->email,
                'avatar' => $question->user->avatar ?? null,
            ],
            'hints' => $question->hints->map(fn($hint) => [
                'id_hint' => $hint->id_hint,
                'image' => $hint->image,
                'hint_description' => $hint->hint_description,
            ]),

            'user_answer' => $userAnswer ? [
                'answer' => $userAnswer->answer,
                'is_correct' => true,
                'answered_at' => $userAnswer->answered_at->toIso8601String(),
            ] : null,

            'attempt_info' => $attemptInfo,
        ]);
    }

    public function checkAnswer(Request $request, $id)
    {
        $request->validate([
            'answer' => 'required',
        ]);

        if (!Auth::check()) {
            return response()->json([
                'error' => 'Anda harus login untuk menjawab soal',
            ], 401);
        }

        $userId = Auth::id();
        $question = Question::with('options')->findOrFail($id);

        // Cek apakah sudah pernah benar
        $existingCorrectAnswer = UserAnswer::where('id_question', $id)
            ->where('id_user', $userId)
            ->where('is_correct', true)
            ->first();

        if ($existingCorrectAnswer) {
            return response()->json([
                'already_answered' => true,
                'is_correct' => true,
                'user_answer' => $existingCorrectAnswer->answer,
                'message' => 'Anda sudah menjawab soal ini dengan benar!',
            ]);
        }

        // Cek cooldown
        $cooldownCheck = $this->checkCooldown($id, $userId);
        if ($cooldownCheck['is_cooldown']) {
            return response()->json([
                'is_cooldown' => true,
                'cooldown_remaining' => $cooldownCheck['remaining_seconds'],
                'message' => $cooldownCheck['message'],
            ], 429);
        }

        /*
     |----------------------------------------------------------
     | LOGIKA VALIDASI JAWABAN
     |----------------------------------------------------------
     | Multiple choice = bandingkan dengan table question_options
     | Essay = bandingkan dengan field correct_answer di table questions
     */

        $isCorrect = false;

        // Jika soal punya correct_answer = berarti mode isian
        if ($question->correct_answer !== null) {
            $isCorrect = strtolower(trim($request->answer)) === strtolower(trim($question->correct_answer));
        } else {
            // Multiple choice
            $selectedOption = $question->options()
                ->where('id_question_option', $request->answer)
                ->first();

            if ($selectedOption && $selectedOption->is_correct) {
                $isCorrect = true;
            }
        }

        if ($isCorrect) {
            // Simpan jawaban hanya jika benar
            UserAnswer::create([
                'id_question' => $id,
                'id_user' => $userId,
                'answer' => $request->answer,
                'is_correct' => true,
                'answered_at' => now(),
            ]);

            // Clear attempt setelah benar
            $this->clearAttempts($id, $userId);

            return response()->json([
                'is_correct' => true,
                'user_answer' => $request->answer,
                'message' => 'Selamat! Jawaban Anda benar! 🎉',
            ]);
        }

        // jika salah
        $attemptInfo = $this->incrementAttempt($id, $userId);

        return response()->json([
            'is_correct' => false,
            'user_answer' => $request->answer,
            'message' => 'Jawaban salah. Silakan coba lagi!',
            'attempts_remaining' => $attemptInfo['attempts_remaining'],
            'total_attempts' => $attemptInfo['total_attempts'],
            'is_cooldown' => $attemptInfo['is_cooldown'],
            'cooldown_remaining' => $attemptInfo['cooldown_remaining'] ?? null,
        ]);
    }

    private function clearAttempts($questionId, $userId)
    {
        $attemptKey = "attempts:q{$questionId}:u{$userId}";
        $cooldownKey = "cooldown:q{$questionId}:u{$userId}";

        Cache::forget($attemptKey);
        Cache::forget($cooldownKey);
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

    private function checkCooldown($questionId, $userId)
    {
        $cooldownKey = "cooldown:q{$questionId}:u{$userId}";
        $cooldownUntil = Cache::get($cooldownKey);

        if ($cooldownUntil) {
            $remaining = $cooldownUntil - time();
            if ($remaining > 0) {
                $minutes = ceil($remaining / 60);
                return [
                    'is_cooldown' => true,
                    'remaining_seconds' => $remaining,
                    'message' => "Anda harus menunggu {$minutes} menit sebelum mencoba lagi.",
                ];
            }
        }

        return ['is_cooldown' => false];
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
}

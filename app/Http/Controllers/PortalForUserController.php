<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Tag;
use App\Models\UserAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PortalForUserController extends Controller
{
      public function index()
    {
        $query = Question::with(['tags', 'favoritedBy']);

        if (Auth::check()) {
            $query->with(['favoritedBy' => function($q) {
                $q->where('users.id_user', Auth::id());
            }]);
        }

        $tasks = $query->get()->map(function ($question) {
            return [
                'id_question' => $question->id_question,
                'title' => $question->title,
                'location_name' => $question->location_name,
                'latitude' => (float) $question->latitude,
                'longitude' => (float) $question->longitude,
                'question_image' => $question->question_image_url,
                'tags' => $question->tags,
                'grade' => $question->grade,
                'is_favorite' => Auth::check()
                    ? $question->favoritedBy->isNotEmpty()
                    : false,
                'created_at' => $question->created_at->toIso8601String(),
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
        $question = Question::with(['tags', 'user', 'favoritedBy', 'hints'])
            ->findOrFail($id);

        if (Auth::check()) {
            $question->load(['favoritedBy' => function($q) {
                $q->where('users.id_user', Auth::id());
            }]);
        }

        $userAnswer = null;
        if (Auth::check()) {
            $userAnswer = UserAnswer::where('id_question', $id)
                ->where('id_user', Auth::id())
                ->orderBy('answered_at', 'desc')
                ->first();
        }

        return response()->json([
            'id_question' => $question->id_question,
            'title' => $question->title,
            'question' => $question->question,
            'location_name' => $question->location_name,
            'latitude' => (float) $question->latitude,
            'longitude' => (float) $question->longitude,
            'question_image' => $question->question_image_url, 
            'tags' => $question->tags,
            'grade' => $question->grade,
            'is_favorite' => Auth::check()
                ? $question->favoritedBy->isNotEmpty()
                : false,
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
                'is_correct' => $userAnswer->is_correct,
                'answered_at' => $userAnswer->answered_at->toIso8601String(),
                'correct_answer' => !$userAnswer->is_correct
                    ? $this->formatCorrectAnswer($question->correct_answer)
                    : null,
            ] : null,
        ]);
    }

    public function checkAnswer(Request $request, $id)
{
    $request->validate([
        'answer' => 'required|string',
    ]);

    if (!Auth::check()) {
        return response()->json([
            'error' => 'Anda harus login untuk menjawab soal',
        ], 401);
    }

    $question = Question::findOrFail($id);

    // Cek apakah sudah pernah jawab BENAR sebelumnya
    $existingCorrectAnswer = UserAnswer::where('id_question', $id)
        ->where('id_user', Auth::id())
        ->where('is_correct', true)
        ->first();

    if ($existingCorrectAnswer) {
        return response()->json([
            'already_answered' => true,
            'is_correct' => true,
            'user_answer' => $existingCorrectAnswer->answer,
            'message' => 'Anda sudah menjawab soal ini dengan benar sebelumnya! ',
        ]);
    }

    $isCorrect = $this->validateAnswer($request->answer, $question->correct_answer);


    if ($isCorrect) {
        UserAnswer::create([
            'id_question' => $id,
            'id_user' => Auth::id(),
            'answer' => $request->answer,
            'is_correct' => true,
            'answered_at' => now(),
        ]);

        return response()->json([
            'is_correct' => true,
            'user_answer' => $request->answer,
            'message' => 'Jawaban Anda benar! ',
            'saved_to_db' => true,
        ]);
    } else {

        return response()->json([
            'is_correct' => false,
            'user_answer' => $request->answer,
            'message' => 'Jawaban Anda salah. Silakan coba lagi!',
            'saved_to_db' => false,
        ]);
    }
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

    private function formatCorrectAnswer($correctAnswerPattern)
    {
        if (!preg_match('/^\/.*\/[a-z]*$/i', $correctAnswerPattern)) {
            return $correctAnswerPattern;
        }

        $pattern = preg_replace('/^\/\^?/', '', $correctAnswerPattern);
        $pattern = preg_replace('/\$?\/[a-z]*$/i', '', $pattern);

        if (preg_match('/^([^(\\\\]+)/', $pattern, $matches)) {
            $mainAnswer = $matches[1];

            $mainAnswer = str_replace(['\\s?', '\\?', '\\.', '\\', ','], '', $mainAnswer);

            if (preg_match('/\(\\s\?([^)]+)\)\?/', $pattern, $unitMatches)) {
                $unit = $unitMatches[1];
                $unit = str_replace(['\\s?', '\\?', '\\'], '', $unit);

                $units = explode('|', $unit);
                if (!empty($units[0])) {
                    return trim($mainAnswer) . ' ' . trim($units[0]);
                }
            }

            return trim($mainAnswer);
        }

        $cleaned = str_replace(['/', '^', '$', '\\s?', '\\?', '(', ')', '|', '\\', ','], '', $correctAnswerPattern);
        return trim($cleaned);
    }

    public function toggleFavorite($questionId)
    {
        if (!Auth::check()) {
            return back()->with('error', 'Anda harus login untuk memfavoritkan soal.');
        }

        $question = Question::findOrFail($questionId);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $isFavorite = $user->favoriteQuestions()->where('questions.id_question', $questionId)->exists();

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

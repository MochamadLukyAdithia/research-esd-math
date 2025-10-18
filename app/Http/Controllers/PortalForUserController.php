<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Tag;
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
                'question_image' => $question->question_image,
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

<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Tag;
use App\Models\District;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PortalForAdminController extends Controller
{

    public function create()
    {
        // $tags = Tag::all();
        // $districts = District::all();

        // return Inertia::render('Questions/Create', [
        //     'tags' => $tags,
        //     'districts' => $districts
        // ]);
    }

    public function index() {
        $questions = Question::with(['user', 'district', 'tags', 'hints'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $questions
        ]);
    }

    public function store(Request $request)
    {

        // EXAMPLE RESPONSE JSON
        //
        // {
        //     "title": "Test Question",
        //     "question": "What is the answer?",
        //     "location_name": "Test Location",
        //     "longitude": 112.5,
        //     "latitude": -7.5,
        //     "correct_answer": 42,
        //     "id_district": 1,
        //     "question_image": "https://example.com/image.jpg",
        //     "tag_ids": [1, 2],
        //     "hints": [
        //         {
        //             "hint_description": "First hint",
        //             "image": "https://example.com/hint1.jpg"
        //         }
        //     ]
        // }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'question' => 'required|string',
            'location_name' => 'required|string|max:255',
            'longitude' => 'required|numeric',
            'latitude' => 'required|numeric',
            'correct_answer' => 'required|numeric',
            'id_district' => 'required|exists:districts,id_district',
            'question_image' => 'nullable|string|url',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id_tag',
            'hints' => 'nullable|array',
            'hints.*.hint_description' => 'required|string',
            'hints.*.image' => 'nullable|string|url',
        ]);

        DB::beginTransaction();

        try {
            $userId = $request->input('id_user', 1);

            $question = Question::create([
                'title' => $validated['title'],
                'question' => $validated['question'],
                'location_name' => $validated['location_name'],
                'longitude' => $validated['longitude'],
                'latitude' => $validated['latitude'],
                'correct_answer' => $validated['correct_answer'],
                'question_image' => $validated['question_image'] ?? null,
                'id_district' => $validated['id_district'],
                'id_user' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!empty($validated['tag_ids'])) {
                $question->tags()->attach($validated['tag_ids']);
            }

            if (!empty($validated['hints'])) {
                foreach ($validated['hints'] as $hintData) {
                    $question->hints()->create([
                        'hint_description' => $hintData['hint_description'],
                        'image' => $hintData['image'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Question created successfully',
                'data' => $question->load(['tags', 'hints', 'user', 'district'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create question',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id) {
        $question = Question::with(['user', 'district', 'tags', 'hints'])
            ->findOrFail($id);  

        return response()->json([
            'success' => true,
            'data' => $question
        ]);
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'question' => 'required|string',
            'location_name' => 'required|string|max:255',
            'longitude' => 'required|numeric',
            'latitude' => 'required|numeric',
            'correct_answer' => 'required|numeric',
            'id_district' => 'required|exists:districts,id_district',
            'question_image' => 'nullable|string|url',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id_tag',
            'hints' => 'nullable|array',
            'hints.*.hint_description' => 'required|string',
            'hints.*.image' => 'nullable|string|url',
        ]);

        $question = Question::findOrFail($id);
        $question->update([
            'title' => $validated['title'],
            'question' => $validated['question'],
            'location_name' => $validated['location_name'],
            'longitude' => $validated['longitude'],
            'latitude' => $validated['latitude'],
            'correct_answer' => $validated['correct_answer'],
            'question_image' => $validated['question_image'] ?? null,
            'id_district' => $validated['id_district'],
            'updated_at' => now(),
        ]);

        if (!empty($validated['tag_ids'])) {
            $question->tags()->sync($validated['tag_ids']);
        }

        if (!empty($validated['hints'])) {
            foreach ($validated['hints'] as $hintData) {
                $question->hints()->create([
                    'hint_description' => $hintData['hint_description'],
                    'image' => $hintData['image'] ?? null,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Question updated successfully',
            'data' => $question->load(['tags', 'hints', 'user', 'district'])
        ]); 
    }

    public function destroy($id)
    {
        $question = Question::findOrFail($id);
        $question->delete();

        return response()->json([
            'success' => true,
            'message' => 'Question deleted successfully',
        ]);
    }
}

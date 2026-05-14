<?php
// ─────────────────────────────────────────────────────────────────────────────
// File: app/Http/Requests/SubmitAnswerRequest.php
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'answers'   => ['required', 'array'],
            'answers.*' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'answers.required'   => 'Jawaban tidak boleh kosong.',
            'answers.array'      => 'Format jawaban tidak valid.',
            'answers.*.required' => 'Semua soal harus dijawab.',
        ];
    }
}
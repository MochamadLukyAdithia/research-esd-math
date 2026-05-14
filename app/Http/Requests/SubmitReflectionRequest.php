<?php
// ─────────────────────────────────────────────────────────────────────────────
// File: app/Http/Requests/SubmitReflectionRequest.php
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitReflectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'understood_concepts'   => ['nullable', 'string', 'max:500'],
            'difficult_parts'       => ['nullable', 'string', 'max:500'],
            'most_helpful_activity' => ['nullable', 'string', 'max:500'],
            'rating'                => ['nullable', 'integer', 'min:1', 'max:5'],
        ];
    }
}
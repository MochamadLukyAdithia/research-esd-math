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

    /**
     * Nilai yang valid untuk setiap pertanyaan refleksi diri.
     * Sesuai pilihan pada form dokumen ESDMathPath.
     */
    private const VALID_ANSWERS = ['sudah_mampu', 'cukup_mampu', 'perlu_dibimbing'];

    public function rules(): array
    {
        $answers = implode(',', self::VALID_ANSWERS);

        return [
            // P1: Kemampuan menggunakan platform ESDMathPath
            'q1_platform_usage'    => ['required', "in:{$answers}"],

            // P2: Kemampuan memahami informasi/data/grafik
            'q2_data_comprehension' => ['required', "in:{$answers}"],

            // P3: Kemampuan menerapkan konsep matematika ke konteks nyata
            'q3_math_application'  => ['required', "in:{$answers}"],

            // P4: Kemampuan menjelaskan alasan/langkah penyelesaian
            'q4_reasoning'         => ['required', "in:{$answers}"],
        ];
    }

    public function messages(): array
    {
        return [
            'q1_platform_usage.required'     => 'Pertanyaan 1 wajib dijawab.',
            'q1_platform_usage.in'           => 'Jawaban pertanyaan 1 tidak valid.',
            'q2_data_comprehension.required' => 'Pertanyaan 2 wajib dijawab.',
            'q2_data_comprehension.in'       => 'Jawaban pertanyaan 2 tidak valid.',
            'q3_math_application.required'   => 'Pertanyaan 3 wajib dijawab.',
            'q3_math_application.in'         => 'Jawaban pertanyaan 3 tidak valid.',
            'q4_reasoning.required'          => 'Pertanyaan 4 wajib dijawab.',
            'q4_reasoning.in'                => 'Jawaban pertanyaan 4 tidak valid.',
        ];
    }
}
<?php

namespace App\Exports;

use App\Models\UserAnswer;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UserAnswersExport implements FromQuery, WithHeadings, WithMapping
{
    public function query()
    {
        return UserAnswer::query()->with(['question', 'user']);
    }

    public function headings(): array
    {
        return [
            'Judul'
            'Soal',
            'User',
            'Jawaban',
            'Status (Benar/Salah)',
            'Dijawab',
            'Dibuat',
            'Diupdate',
        ];
    }

    public function map($userAnswer): array
    {
        return [
            $userAnswer->question->title ?? '-',
            $userAnswer->question->question ?? '-',
            $userAnswer->user->name ?? '-',
            $userAnswer->answer,
            $userAnswer->is_correct ? 'Benar' : 'Salah',
            $userAnswer->answered_at?->format('d M Y H:i') ?? '-',
            $userAnswer->created_at?->format('d M Y H:i') ?? '-',
            $userAnswer->updated_at?->format('d M Y H:i') ?? '-',
        ];
    }
}

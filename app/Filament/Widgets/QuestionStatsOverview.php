<?php

namespace App\Filament\Widgets;

use App\Models\Question;
use App\Models\UserAnswer;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class QuestionStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalQuestions = Question::count();
        $totalAnswers = UserAnswer::count();
        $totalCorrectAnswers = UserAnswer::where('is_correct', true)->count();


        $averageGrade = Question::avg('grade');
        $accuracyRate = $totalAnswers > 0 ? round(($totalCorrectAnswers / $totalAnswers) * 100, 1) : 0;

        return [
            Stat::make('Total Soal', $totalQuestions)
                ->description('Jumlah soal yang tersedia')
                ->descriptionIcon('heroicon-o-document-text')
                ->color('primary')
                // ->chart([7, 2, 10, 3, 15, 4, 17])
                ->extraAttributes([
                    'class' => 'cursor-pointer',
                ]),

            Stat::make('Total Jawaban', $totalAnswers)
                ->description('Seluruh jawaban dari user')
                ->descriptionIcon('heroicon-o-chat-bubble-left-ellipsis')
                ->color('success'),
                // ->chart([3, 5, 8, 12, 15, 18, 20]),



            Stat::make('Rata-rata Tingkat Kesulitan', round($averageGrade, 1))
                ->description('Skala 1-10')
                ->descriptionIcon('heroicon-o-chart-bar')
                ->color($averageGrade >= 7 ? 'danger' : ($averageGrade >= 5 ? 'warning' : 'info'))
                // ->chart([5, 4, 6, 5, 7, 6, 5]),



        ];
    }

    // Optional: Update interval
    protected function getPollingInterval(): ?string
    {
        return '30s';
    }
}

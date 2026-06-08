<?php

namespace App\Filament\Widgets;

use App\Models\LearningPath;
use App\Models\UserLearningPathProgress;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class LearningPathStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalPaths      = LearningPath::count();
        $publishedPaths  = LearningPath::published()->count();
        $totalEnrollments= UserLearningPathProgress::count();
        $completedCount  = UserLearningPathProgress::where('status', 'completed')->count();

        $completionRate  = $totalEnrollments > 0
            ? round(($completedCount / $totalEnrollments) * 100, 1)
            : 0;

        $avgImprovement  = UserLearningPathProgress::whereNotNull('pre_test_score')
            ->whereNotNull('post_test_score')
            ->selectRaw('AVG(post_test_score - pre_test_score) as avg_improvement')
            ->value('avg_improvement');

        return [
            Stat::make('Total Learning Path', $totalPaths)
                ->description("{$publishedPaths} dipublikasi")
                ->descriptionIcon('heroicon-o-eye')
                ->color('primary')
                ->icon('heroicon-o-academic-cap'),

            Stat::make('Total Enrollment', number_format($totalEnrollments))
                ->description("{$completedCount} selesai")
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('success')
                ->icon('heroicon-o-users'),

            Stat::make('Completion Rate', $completionRate . '%')
                ->description('Tingkat penyelesaian')
                ->descriptionIcon('heroicon-o-chart-bar')
                ->color($completionRate >= 70 ? 'success' : ($completionRate >= 40 ? 'warning' : 'danger'))
                ->icon('heroicon-o-trophy'),

            Stat::make('Rata-rata Peningkatan', ($avgImprovement !== null ? round($avgImprovement, 1) : 0) . ' poin')
                ->description('Pre-test ke post-test')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('info')
                ->icon('heroicon-o-chart-bar-square'),
        ];
    }
}
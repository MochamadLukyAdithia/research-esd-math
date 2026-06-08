<?php
// ─────────────────────────────────────────────────────────────────────────────
// File: app/Filament/Resources/LearningPaths/Pages/ListLearningPaths.php
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Filament\Resources\LearningPaths\Pages;

use App\Filament\Resources\LearningPaths\LearningPathResource;
use App\Models\LearningPath;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListLearningPaths extends ListRecords
{
    protected static string $resource = LearningPathResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Buat Learning Path')
                ->icon('heroicon-o-plus'),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\LearningPathStatsWidget::class,
        ];
    }
}
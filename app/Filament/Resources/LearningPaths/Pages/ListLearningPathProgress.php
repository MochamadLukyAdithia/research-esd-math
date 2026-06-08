<?php

namespace App\Filament\Resources\LearningPaths\Pages;

use App\Filament\Resources\LearningPaths\LearningPathProgressResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListLearningPathProgress extends ListRecords
{
    protected static string $resource = LearningPathProgressResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('export')
                ->label('Export CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('gray')
                ->action(function () {
                    // TODO: implement CSV export
                }),
        ];
    }
}
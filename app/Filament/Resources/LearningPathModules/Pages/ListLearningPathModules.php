<?php

namespace App\Filament\Resources\LearningPathModules\Pages;

use App\Filament\Resources\LearningPathModules\LearningPathModuleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLearningPathModules extends ListRecords
{
    protected static string $resource = LearningPathModuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}

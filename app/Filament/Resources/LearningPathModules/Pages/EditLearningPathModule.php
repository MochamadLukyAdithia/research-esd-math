<?php

namespace App\Filament\Resources\LearningPathModules\Pages;

use App\Filament\Resources\LearningPathModules\LearningPathModuleResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditLearningPathModule extends EditRecord
{
    protected static string $resource = LearningPathModuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}

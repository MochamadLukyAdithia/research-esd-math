<?php

namespace App\Filament\Resources\UserAnswers\Pages;

use App\Filament\Resources\UserAnswers\UserAnswerResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewUserAnswer extends ViewRecord
{
    protected static string $resource = UserAnswerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}

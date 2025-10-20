<?php

namespace App\Filament\Resources\UserAnswers\Pages;

use App\Filament\Resources\UserAnswers\UserAnswerResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditUserAnswer extends EditRecord
{
    protected static string $resource = UserAnswerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            
            DeleteAction::make(),
        ];
    }
}

<?php

namespace App\Filament\Resources\UserAnswers\Pages;

use App\Filament\Resources\UserAnswers\UserAnswerResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUserAnswer extends CreateRecord
{
    protected static string $resource = UserAnswerResource::class;
}

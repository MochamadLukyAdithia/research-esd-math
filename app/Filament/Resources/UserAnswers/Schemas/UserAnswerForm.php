<?php

namespace App\Filament\Resources\UserAnswers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class UserAnswerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('id_question')
                    ->required()
                    ->numeric(),
                TextInput::make('id_user')
                    ->required()
                    ->numeric(),
                Textarea::make('answer')
                    ->required()
                    ->columnSpanFull(),
                Toggle::make('is_correct')
                    ->required(),
                DateTimePicker::make('answered_at')
                    ->required(),
            ]);
    }
}

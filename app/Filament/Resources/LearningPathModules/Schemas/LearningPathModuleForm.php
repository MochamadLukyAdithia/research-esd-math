<?php

namespace App\Filament\Resources\LearningPathModules\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class LearningPathModuleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('id_learning_path')
                    ->required()
                    ->numeric(),
                TextInput::make('title')
                    ->required(),
                Select::make('type')
                    ->options([
            'pre_test' => 'Pre test',
            'material' => 'Material',
            'activity' => 'Activity',
            'post_test' => 'Post test',
            'reflection' => 'Reflection',
        ])
                    ->required(),
                TextInput::make('order_number')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_required')
                    ->required(),
            ]);
    }
}

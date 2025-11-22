<?php

namespace App\Filament\Resources\News\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;

class NewsForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Judul Berita')
                    ->required()
                    ->columnSpanFull()
                    ->maxLength(255),
                FileUpload::make('image')
                    ->directory('news') 
                    ->disk('public')    
                    ->image()          
                    ->required()
                    ->preserveFilenames() 
                    ->columnSpanFull(),
                Textarea::make('description')
                    ->label('Deskripsi')
                    ->columnSpanFull()
                    ->required(),
            ]);
    }
}

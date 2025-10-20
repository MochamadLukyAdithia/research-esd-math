<?php

namespace App\Filament\Resources\Questions\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class QuestionInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // HEADER - INFORMASI UTAMA
                TextEntry::make('title')
                    ->label('Judul Soal')
                    ->size('lg')
                    ->weight('bold')
                    ->columnSpanFull(),

                TextEntry::make('question')
                    ->label('Pertanyaan')
                    ->columnSpanFull(),

                // LOKASI & MAP
                TextEntry::make('location_name')
                    ->label('Nama Lokasi')
                    ->weight('bold')
                    ->size('lg'),

                TextEntry::make('latitude')
                    ->label('Latitude')
                    ->numeric(),

                TextEntry::make('longitude')
                    ->label('Longitude')
                    ->numeric(),

               
                \Filament\Infolists\Components\ViewEntry::make('map')
                    ->view('filament.infolists.components.map-view')
                    ->columnSpanFull(),

                // INFORMASI LAINNYA
                TextEntry::make('grade')
                    ->label('Tingkat Kesulitan')
                    ->numeric()
                    ->formatStateUsing(fn ($state) => "Level {$state}"),

                ImageEntry::make('question_image')
                    ->label('Gambar Soal')
                    ->columnSpanFull()
                    ->hidden(fn ($state) => empty($state)),

                TextEntry::make('user.name')
                    ->label('Dibuat Oleh')
                    ->formatStateUsing(fn ($state, $record) => $state ?? "User ID: {$record->id_user}"),

                TextEntry::make('correct_answer')
                    ->label('Jawaban Benar')
                    ->columnSpanFull()
                    ->badge()
                    ->color('success'),

                TextEntry::make('tags.tag_name')
                    ->label('Tags')
                    ->badge()
                    ->separator(',')
                    ->color('primary'),

                TextEntry::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime('d F Y H:i')
                    ->placeholder('-'),

                TextEntry::make('updated_at')
                    ->label('Diupdate Pada')
                    ->dateTime('d F Y H:i')
                    ->placeholder('-'),
            ]);
    }
}

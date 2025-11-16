<?php

namespace App\Filament\Resources\Questions\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\RepeatableEntry;
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

                TextEntry::make('questionType.question_type')
                    ->label('Tipe Soal')
                    ->badge()
                    ->color('primary'),

                TextEntry::make('tags.tag_name')
                    ->label('Tags')
                    ->badge()
                    ->separator(',')
                    ->color('primary'),

                RepeatableEntry::make('questionImages')
                    ->label('Gambar Soal')
                    ->schema([
                        ImageEntry::make('image_path')
                            ->label('Gambar')
                            ->getStateUsing(fn($record) => asset('storage/' . $record->image_path))
                            ->columnSpanFull()
                            ->height(200)
                            ->columnSpan(1),
                    ])
                    ->columns(3)
                    ->columnSpanFull()
                    ->visible(fn($record) => $record->questionImages()->exists()),


                // LOKASI & MAP
                TextEntry::make('location_name')
                    ->label('Nama Lokasi')
                    ->weight('bold')
                    ->size('lg'),

                //poin
                TextEntry::make('points')
                    ->label('Poin')
                    ->numeric(),


                \Filament\Infolists\Components\ViewEntry::make('map')
                    ->view('filament.infolists.components.map-view')
                    ->label('Peta Lokasi')
                    ->columnSpanFull(),

                // TextEntry::make('latitude')
                //     ->label('Latitude')
                //     ->numeric(),

                // TextEntry::make('longitude')
                //     ->label('Longitude')
                //     ->numeric(),

                // INFORMASI LAINNYA
                TextEntry::make('grade')
                    ->label('Tingkat Kesulitan')
                    ->numeric()
                    ->formatStateUsing(fn($state) => "Level {$state}"),


                TextEntry::make('user.name')
                    ->label('Dibuat Oleh')
                    ->formatStateUsing(fn($state, $record) => $state ?? "User ID: {$record->id_user}"),

                TextEntry::make('correct_answer')
                    ->label('Jawaban Benar')
                    ->columnSpanFull()
                    ->badge()
                    ->color('success')
                    ->visible(fn($record) => $record->questionType && $record->questionType->question_type === 'isian'),

                RepeatableEntry::make('questionOptions')
                    ->label('Pilihan Jawaban')
                    ->schema([
                        TextEntry::make('option_text')
                            ->formatStateUsing(function ($state, $record) {
                                $isCorrect = (bool)($record['is_correct']);

                                return $isCorrect
                                    ? "{$state} (benar)"
                                    : "{$state} (salah)";
                            })
                            ->weight(function ($record) {
                                return (bool) $record->is_correct ? 'bold' : 'normal';
                            })
                            ->color(function ($record) {
                                return (bool) $record->is_correct ? 'success' : 'danger';
                            })
                    ])
                    ->columnSpanFull()
                    ->visible(fn($record) => $record->questionType?->question_type === 'pilihan_ganda'),


                RepeatableEntry::make('hints')
                    ->label('Petunjuk')
                    ->schema([
                        TextEntry::make('hint_description')->label('Hint'),
                    ])
                    ->visible(fn($record) => $record->hints()->exists())
                    ->columnSpanFull(),

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

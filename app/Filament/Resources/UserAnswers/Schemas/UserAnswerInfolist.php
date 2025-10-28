<?php

namespace App\Filament\Resources\UserAnswers\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class UserAnswerInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // ✅ RELASI QUESTION - tampilkan judul soal
                TextEntry::make('question.title')
                    ->label('Judul Soal')
                    ->columnSpanFull()
                    ->weight('bold'),

                
                TextEntry::make('user.name')
                    ->label('Nama User')
                    ->weight('medium'),


                TextEntry::make('answer')
                    ->label('Jawaban User')
                    ->columnSpanFull()
                    ->placeholder('Belum menjawab')
                    ->html(),


                IconEntry::make('is_correct')
                    ->label('Status Jawaban')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->formatStateUsing(fn ($state) => $state ? 'Benar' : 'Salah'),

                TextEntry::make('answered_at')
                    ->label('Dijawab Pada')
                    ->dateTime('d F Y H:i')
                    ->placeholder('Belum dijawab'),



            ]);
    }
}

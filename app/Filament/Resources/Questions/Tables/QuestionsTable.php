<?php

namespace App\Filament\Resources\Questions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Table;
use Filament\Support\Icons\Heroicon;

class QuestionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([


              TextColumn::make('question')
                        ->label('Pertanyaan')
                        ->limit(40)
                        ->tooltip(fn ($record) => $record->question)
                        ->searchable(),

                TextColumn::make('location_name')
                    ->label('Nama Lokasi')
                    ->icon(Heroicon::MapPin)
                    ->searchable(),


                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Diperbarui')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}

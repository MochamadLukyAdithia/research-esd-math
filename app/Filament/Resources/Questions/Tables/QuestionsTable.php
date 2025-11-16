<?php

namespace App\Filament\Resources\Questions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Table;
use Filament\Support\Icons\Heroicon;
use App\Helpers\NavigationHelper;

class QuestionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([


                TextColumn::make('title')
                    ->label('Judul Soal')
                    ->searchable()
                    ->sortable()
                    ->limit(50),

                TextColumn::make('location_name')
                    ->label('Nama Lokasi')
                    ->icon(Heroicon::MapPin)
                    ->searchable(),


                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                //poin
                TextColumn::make('points')
                    ->label('Poin')
                    ->numeric(),

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
                EditAction::make()
                    ->hidden(fn() => NavigationHelper::isQuestionOnlyAdmin()),
                DeleteAction::make()
                    ->hidden(fn() => NavigationHelper::isQuestionOnlyAdmin()),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->hidden(fn() => NavigationHelper::isQuestionOnlyAdmin()),
                ]),
            ]);
    }
}

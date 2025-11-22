<?php

namespace App\Filament\Resources\UserAnswers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\UserAnswersExport;


class UserAnswersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('question.title')
                    ->label('Judul Soal')
                    ->limit(30)
                    ->searchable()
                    ->sortable()
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        return $state;
                    }),

                TextColumn::make('question.question')
                    ->label('Soal')
                    ->limit(30)
                    ->searchable()
                    ->sortable()
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        return $state;
                    }),


                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('answer')
                    ->label('Jawaban')
                    ->limit(25)
                    ->searchable()
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        return $state;
                    }),




                IconColumn::make('is_correct')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->sortable(),


                TextColumn::make('answered_at')
                    ->label('Dijawab')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->since()
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        return $state;
                    }),


                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Diupdate')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
                // ->headerActions([
                //     Actions::make('export')
                //         ->label('Export to Excel')
                //         ->icon('heroicon-o-download')
                //         ->action(fn () => Excel::download(new UserAnswersExport, 'user_answers.xlsx')),
                // ])


            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                DeleteAction::make(),

            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}

<?php

namespace App\Filament\Resources\LearningPaths\Schemas;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\BulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Illuminate\Support\Str;

class LearningPathResource
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('')
                    ->disk('public')               
                    ->width(100)
                    ->height(64)
                    ->defaultImageUrl(fn() => asset('images/placeholder.png'))
                    ->extraImgAttributes(['class' => 'rounded-lg object-cover']),

                TextColumn::make('title')
                    ->label('Judul Learning Path')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold')
                    ->description(fn($record) => Str::limit($record->description, 50))
                    ->words(50),

                TextColumn::make('grade')
                    ->label('Kelas')
                    ->formatStateUsing(fn($state) => 'Kelas ' . $state)
                    ->badge()
                    ->color('info')
                    ->sortable()
                    ->alignCenter(),

                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color('primary')
                    ->searchable(),

                TextColumn::make('modules_count')
                    ->label('Jumlah Modul')
                    ->counts('modules')
                    ->numeric()
                    ->alignCenter()
                    ->color('gray')
                    ->suffix(' modul'),

                TextColumn::make('estimated_minutes')
                    ->label('Estimasi')
                    ->formatStateUsing(fn($state) => $state < 60
                        ? "{$state} mnt"
                        : floor($state / 60) . ' jam ' . ($state % 60 > 0 ? ($state % 60) . ' mnt' : '')
                    )
                    ->icon('heroicon-o-clock')
                    ->color('gray')
                    ->alignCenter(),

                TextColumn::make('userProgress_count')
                    ->label('Peserta')
                    ->getStateUsing(fn($record) => $record->userProgress()->count())
                    ->numeric()
                    ->alignCenter()
                    ->color('success')
                    ->suffix(' siswa'),

                IconColumn::make('is_published')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->alignCenter(),

                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->color('gray')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('grade')
                    ->label('Kelas')
                    ->options([
                        7 => 'Kelas 7', 8 => 'Kelas 8', 9 => 'Kelas 9',
                        10 => 'Kelas 10', 11 => 'Kelas 11', 12 => 'Kelas 12',
                    ]),

                SelectFilter::make('category')
                    ->label('Kategori')
                    ->options(fn() => \App\Models\LearningPath::distinct()->pluck('category', 'category')->toArray()),

                TernaryFilter::make('is_published')
                    ->label('Status Publikasi')
                    ->trueLabel('Sudah Dipublikasi')
                    ->falseLabel('Draft')
                    ->placeholder('Semua'),
            ])
            ->actions([
                EditAction::make()
                    ->label('Edit dan Kelola Modul'),

                Action::make('toggle_publish')
                    ->label(fn($record) => $record->is_published ? 'Sembunyikan' : 'Publikasikan')
                    ->icon(fn($record) => $record->is_published ? 'heroicon-o-eye-slash' : 'heroicon-o-eye')
                    ->color(fn($record) => $record->is_published ? 'warning' : 'success')
                    ->requiresConfirmation()
                    ->action(fn($record) => $record->update(['is_published' => !$record->is_published])),

                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    BulkAction::make('publish')
                        ->label('Publikasikan')
                        ->icon('heroicon-o-eye')
                        ->color('success')
                        ->action(fn($records) => $records->each->update(['is_published' => true])),

                    BulkAction::make('unpublish')
                        ->label('Sembunyikan')
                        ->icon('heroicon-o-eye-slash')
                        ->color('warning')
                        ->action(fn($records) => $records->each->update(['is_published' => false])),

                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('Belum ada Learning Path')
            ->emptyStateDescription('Buat learning path pertama untuk siswa.')
            ->emptyStateIcon('heroicon-o-academic-cap')
            ->defaultSort('created_at', 'desc');
    }
}
<?php

namespace App\Filament\Resources\Leaderboards\Pages;

use App\Filament\Resources\Leaderboards\LeaderboardResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ListLeaderboards extends ListRecords
{
    protected static string $resource = LeaderboardResource::class;

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('rank')
                    ->label('Rank')
                    ->getStateUsing(function ($record, $rowLoop): string {
                        static $rank = 1;
                        return '#' . $rank++;
                    })
                    ->sortable()
                    ->color('primary')
                    ->weight('bold')
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nama User')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),

                Tables\Columns\TextColumn::make('total_points')
                    ->label('Total Poin')
                    ->getStateUsing(fn($record) => $record->points()->sum('points_earned'))
                    ->numeric()
                    ->sortable()
                    ->color('success')
                    ->weight('bold')
                    ->formatStateUsing(fn($state) => number_format($state))
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('questions_solved')
                    ->label('Soal Diselesaikan')
                    ->getStateUsing(fn($record) => $record->points()->count())
                    ->numeric()
                    ->sortable()
                    ->color('info')
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('accuracy_rate')
                    ->label('Akurasi')
                    ->getStateUsing(function ($record) {
                        $totalAnswers = $record->userAnswers()->count();
                        $correctAnswers = $record->userAnswers()->where('is_correct', true)->count();

                        return $totalAnswers > 0 ? round(($correctAnswers / $totalAnswers) * 100, 1) . '%' : '0%';
                    })
                    ->sortable()
                    ->color(fn($state) => match(true) {
                        floatval($state) >= 80 => 'success',
                        floatval($state) >= 60 => 'warning',
                        default => 'danger'
                    })
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('last_activity')
                    ->label('Aktivitas Terakhir')
                    ->getStateUsing(fn($record) => $record->userAnswers()->latest()->first()?->created_at?->diffForHumans() ?? '-')
                    ->sortable()
                    ->color('gray'),
            ])
            ->filters([
                //
            ])
            ->actions([
                // Tidak perlu actions untuk leaderboard
            ])
            ->bulkActions([
                // Tidak perlu bulk actions untuk leaderboard
            ])
            ->emptyStateHeading('Belum ada data leaderboard')
            ->emptyStateDescription('User akan muncul di sini setelah mulai menjawab soal.')
            ->emptyStateIcon('heroicon-o-trophy')
            ->deferLoading();
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('refresh')
                ->label('Refresh Leaderboard')
                ->icon('heroicon-o-arrow-path')
                ->color('gray')
                ->action(fn() => $this->refresh()),
        ];
    }
}

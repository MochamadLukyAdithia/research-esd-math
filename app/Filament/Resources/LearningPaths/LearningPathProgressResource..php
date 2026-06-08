<?php

namespace App\Filament\Resources\LearningPaths;

use App\Helpers\NavigationHelper;
use App\Models\UserLearningPathProgress;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables;
use Filament\Tables\Filters\SelectFilter;

class LearningPathProgressResource extends Resource
{
    protected static ?string $model = UserLearningPathProgress::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ChartBarSquare;

    protected static ?string $navigationLabel = 'Progress Siswa';

    protected static ?string $navigationGroup = 'Konten Belajar';

    protected static ?string $modelLabel = 'Progress Siswa';

    protected static ?int $navigationSort = 3;

    // Read-only resource, tidak ada create/edit
    public static function canCreate(): bool { return false; }
    public static function canEdit($record): bool { return false; }

    public static function shouldRegisterNavigation(): bool
    {
        if (NavigationHelper::isQuestionOnlyAdmin()) {
            return false;
        }

        return true;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->query(
                UserLearningPathProgress::query()
                    ->with(['user', 'learningPath'])
                    ->latest('updated_at')
            )
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Siswa')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),

                Tables\Columns\TextColumn::make('learningPath.title')
                    ->label('Learning Path')
                    ->searchable()
                    ->sortable()
                    ->limit(35),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->formatStateUsing(fn($state) => match ($state) {
                        'not_started' => 'Belum Mulai',
                        'in_progress' => 'Sedang Berjalan',
                        'completed'   => 'Selesai',
                        default       => $state,
                    })
                    ->color(fn($state) => match ($state) {
                        'not_started' => 'gray',
                        'in_progress' => 'info',
                        'completed'   => 'success',
                        default       => 'gray',
                    }),

                Tables\Columns\TextColumn::make('progress_percentage')
                    ->label('Progress')
                    ->formatStateUsing(fn($state) => $state . '%')
                    ->color(fn($state) => $state >= 100 ? 'success' : ($state >= 50 ? 'warning' : 'danger'))
                    ->alignCenter()
                    ->sortable(),

                Tables\Columns\TextColumn::make('pre_test_score')
                    ->label('Pre-Test')
                    ->formatStateUsing(fn($state) => $state !== null ? $state : '-')
                    ->color('warning')
                    ->alignCenter()
                    ->sortable(),

                Tables\Columns\TextColumn::make('post_test_score')
                    ->label('Post-Test')
                    ->formatStateUsing(fn($state) => $state !== null ? $state : '-')
                    ->color('success')
                    ->alignCenter()
                    ->sortable(),

                Tables\Columns\TextColumn::make('score_improvement')
                    ->label('Peningkatan')
                    ->getStateUsing(function ($record) {
                        if ($record->pre_test_score === null || $record->post_test_score === null) return '-';
                        $diff = $record->post_test_score - $record->pre_test_score;
                        return ($diff > 0 ? '+' : '') . $diff;
                    })
                    ->color(fn($state) => match (true) {
                        $state === '-'       => 'gray',
                        str_starts_with($state, '+') => 'success',
                        str_starts_with($state, '-') => 'danger',
                        default => 'gray',
                    })
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('started_at')
                    ->label('Mulai')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->color('gray')
                    ->since(),

                Tables\Columns\TextColumn::make('completed_at')
                    ->label('Selesai')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->color('gray')
                    ->placeholder('-'),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'not_started' => 'Belum Mulai',
                        'in_progress' => 'Sedang Berjalan',
                        'completed'   => 'Selesai',
                    ]),

                SelectFilter::make('id_learning_path')
                    ->label('Learning Path')
                    ->relationship('learningPath', 'title'),
            ])
            ->actions([
                Tables\Actions\Action::make('view_detail')
                    ->label('Detail')
                    ->icon('heroicon-o-eye')
                    ->color('gray')
                    ->url(fn($record) => \App\Filament\Resources\LearningPaths\LearningPathResource::getUrl(
                        'modules', ['record' => $record->id_learning_path]
                    )),
            ])
            ->bulkActions([])
            ->emptyStateHeading('Belum ada data progress')
            ->emptyStateDescription('Progress siswa akan muncul setelah mereka mulai mengerjakan learning path.')
            ->emptyStateIcon('heroicon-o-chart-bar')
            ->defaultSort('updated_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\LearningPaths\Pages\ListLearningPathProgress::route('/'),
        ];
    }
}
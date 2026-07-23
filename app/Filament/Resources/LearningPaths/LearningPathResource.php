<?php

namespace App\Filament\Resources\LearningPaths;

use App\Filament\Resources\LearningPaths\Pages\CreateLearningPath;
use App\Filament\Resources\LearningPaths\Pages\EditLearningPath;
use App\Filament\Resources\LearningPaths\Pages\ListLearningPaths;
use App\Filament\Resources\LearningPaths\RelationManagers\ModulesRelationManager;
use App\Filament\Resources\LearningPaths\Schemas\LearningPathForm;
use App\Filament\Resources\LearningPaths\Schemas\LearningPathResource as LearningPathSchema;
use App\Helpers\NavigationHelper;
use App\Models\LearningPath;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class LearningPathResource extends Resource
{
    protected static ?string $model = LearningPath::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::AcademicCap;

    protected static ?string $navigationLabel = 'Learning Path';
    protected static UnitEnum|string|null $navigationGroup = 'Konten Belajar';

    protected static ?string $modelLabel = 'Learning Path';

    protected static ?string $pluralModelLabel = 'Learning Paths';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'title';

    public static function shouldRegisterNavigation(): bool
    {
        if (NavigationHelper::isQuestionOnlyAdmin()) {
            return false;
        }

        return true;
    }
    public static function canCreate(): bool
{
    return !NavigationHelper::isPengajar();
}

public static function canEdit($record): bool
{
    // tetap izinkan buka halaman "edit" (dipakai sebagai halaman lihat, lihat poin 5)
    return true;
}

public static function canDelete($record): bool
{
    return !NavigationHelper::isPengajar();
}

    public static function form(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema
    {
        return LearningPathForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LearningPathSchema::configure($table);
    }

    // RelationManager tampil otomatis di halaman Edit sebagai tab
    public static function getRelations(): array
    {
        return [
            ModulesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListLearningPaths::route('/'),
            'create' => CreateLearningPath::route('/create'),
            'edit'   => EditLearningPath::route('/{record}/edit'),
            // Tidak perlu page custom modules lagi
        ];
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->withCount('modules');
    }
}
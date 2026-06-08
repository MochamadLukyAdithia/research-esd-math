<?php

namespace App\Filament\Resources\LearningPathModules;

use App\Filament\Resources\LearningPathModules\Pages\CreateLearningPathModule;
use App\Filament\Resources\LearningPathModules\Pages\EditLearningPathModule;
use App\Filament\Resources\LearningPathModules\Pages\ListLearningPathModules;
use App\Filament\Resources\LearningPathModules\Schemas\LearningPathModuleForm;
use App\Filament\Resources\LearningPathModules\Tables\LearningPathModulesTable;
use App\Models\LearningPathModule;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class LearningPathModuleResource extends Resource
{
    protected static ?string $model = LearningPathModule::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::BookOpen;

    protected static ?string $recordTitleAttribute = 'title';

     protected static UnitEnum|string|null $navigationGroup = 'Konten Belajar';

    protected static ?string $navigationLabel = 'Modul Jalur Belajar';

    public static function form(Schema $schema): Schema
    {
        return LearningPathModuleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LearningPathModulesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLearningPathModules::route('/'),
            'create' => CreateLearningPathModule::route('/create'),
            'edit' => EditLearningPathModule::route('/{record}/edit'),
        ];
    }
}

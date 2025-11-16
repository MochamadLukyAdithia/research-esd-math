<?php

namespace App\Filament\Resources\Questions;

use App\Filament\Resources\Questions\Pages\CreateQuestion;
use App\Filament\Resources\Questions\Pages\EditQuestion;
use App\Filament\Resources\Questions\Pages\ListQuestions;
use App\Filament\Resources\Questions\Pages\ViewQuestion;
use App\Filament\Resources\Questions\Schemas\QuestionForm;
use App\Filament\Resources\Questions\Schemas\QuestionInfolist;
use App\Filament\Resources\Questions\Tables\QuestionsTable;
use App\Helpers\NavigationHelper;
use App\Models\Question;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class QuestionResource extends Resource
{
    protected static ?string $model = Question::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::QuestionMarkCircle;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return QuestionForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return QuestionInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return QuestionsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    // Batasi akses Edit
    public static function canEdit($record): bool
    {
        if (NavigationHelper::isQuestionOnlyAdmin()) {
            return false;
        }

        return parent::canEdit($record);
    }

    // Batasi akses Delete
    public static function canDelete($record): bool
    {
        if (NavigationHelper::isQuestionOnlyAdmin()) {
            return false;
        }

        return parent::canDelete($record);
    }

    // Batasi bulk delete
    public static function canDeleteAny(): bool
    {
        if (NavigationHelper::isQuestionOnlyAdmin()) {
            return false;
        }

        return parent::canDeleteAny();
    }

    // Izinkan View (Read)
    public static function canView($record): bool
    {
        return true; 
    }

    // Izinkan Create
    public static function canCreate(): bool
    {
        return true; 
    }

    public static function getPages(): array
    {
        return [
            'index' => ListQuestions::route('/'),
            'create' => CreateQuestion::route('/create'),
            'view' => ViewQuestion::route('/{record}'),
            'edit' => EditQuestion::route('/{record}/edit'),
        ];
    }
}

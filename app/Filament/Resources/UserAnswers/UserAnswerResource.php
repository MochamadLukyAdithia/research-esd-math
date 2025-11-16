<?php

namespace App\Filament\Resources\UserAnswers;

use App\Filament\Resources\UserAnswers\Pages\CreateUserAnswer;
use App\Filament\Resources\UserAnswers\Pages\EditUserAnswer;
use App\Filament\Resources\UserAnswers\Pages\ListUserAnswers;
use App\Filament\Resources\UserAnswers\Pages\ViewUserAnswer;
use App\Filament\Resources\UserAnswers\Schemas\UserAnswerForm;
use App\Filament\Resources\UserAnswers\Schemas\UserAnswerInfolist;
use App\Filament\Resources\UserAnswers\Tables\UserAnswersTable;
use App\Helpers\NavigationHelper;
use App\Models\UserAnswer;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserAnswerResource extends Resource
{
    protected static ?string $model = UserAnswer::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::AcademicCap;

    protected static ?string $recordTitleAttribute = 'name';

    public static function shouldRegisterNavigation(): bool
    {
        // Sembunyikan jika admin khusus question only
        if (NavigationHelper::isQuestionOnlyAdmin()) {
            return false;
        }
        
        return true;
    }

    public static function form(Schema $schema): Schema
    {
        return UserAnswerForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return UserAnswerInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UserAnswersTable::configure($table);
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
            'index' => ListUserAnswers::route('/'),
            // 'create' => CreateUserAnswer::route('/create'),
            'view' => ViewUserAnswer::route('/{record}'),
            'edit' => EditUserAnswer::route('/{record}/edit'),
        ];
    }
}

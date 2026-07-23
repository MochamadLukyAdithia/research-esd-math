<?php

namespace App\Filament\Resources\Badges;

use App\Filament\Resources\Badges\Pages\CreateBadge;
use App\Filament\Resources\Badges\Pages\EditBadge;
use App\Filament\Resources\Badges\Pages\ListBadges;
use App\Filament\Resources\Badges\Schemas\BadgeForm;
use App\Filament\Resources\Badges\Tables\BadgesTable;
use App\Models\Badge;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use App\Helpers\NavigationHelper;

class BadgeResource extends Resource
{
    protected static ?string $model = Badge::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Trophy;

     protected static UnitEnum|string|null $navigationGroup = 'Konten Belajar';
    protected static ?string $navigationLabel = 'Badge';
    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return BadgeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BadgesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

     public static function shouldRegisterNavigation(): bool
    {
        if (NavigationHelper::isQuestionOnlyAdmin()) {
            return false;
        }
            if (NavigationHelper::isPengajar()) {
        return false;
    }
        return true;
    }
    public static function getPages(): array
    {
        return [
            'index' => ListBadges::route('/'),
            'create' => CreateBadge::route('/create'),
            'edit' => EditBadge::route('/{record}/edit'),
        ];
    }
}

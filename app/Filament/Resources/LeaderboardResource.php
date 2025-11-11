<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LeaderboardResource\Pages\ListLeaderboards;
use App\Models\User;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Support\Enums\IconPosition;
use BackedEnum;
use Filament\Support\Icons\Heroicon;


class LeaderboardResource extends Resource
{
    protected static ?string $model = User::class;

       protected static string|BackedEnum|null $navigationIcon = Heroicon::Fire;


    protected static ?string $navigationLabel = 'Leaderboard';

    protected static ?string $modelLabel = 'Leaderboard';

    protected static ?int $navigationSort = 2;

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
              
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLeaderboards::route('/'),
        ];
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()
            ->whereHas('points')
            ->withSum('points as total_points_sum', 'points_earned')
            ->orderBy('total_points_sum', 'desc');
    }
}

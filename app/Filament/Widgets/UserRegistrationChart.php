<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class UserRegistrationChart extends ChartWidget
{
    protected ?string $heading = 'User Registration Chart';

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {

        $months = collect();
        $data = collect();

        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $months->push($month->format('M Y'));
            $data->push(User::whereYear('created_at', $month->year)
                            ->whereMonth('created_at', $month->month)
                            ->count());
        }

        return [
            'labels' => $months->toArray(),
            'datasets' => [
                [
                    'label' => 'Registrations',
                    'data' => $data->toArray(),
                ],
            ],
        ];
    }
}

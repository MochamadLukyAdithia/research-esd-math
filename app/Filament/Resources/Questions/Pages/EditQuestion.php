<?php

namespace App\Filament\Resources\Questions\Pages;

use App\Filament\Resources\Questions\QuestionResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditQuestion extends EditRecord
{
    protected static string $resource = QuestionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];


    }
    public function updateCoordinates($latitude, $longitude): void
    {
        $this->form->fill([
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]);
    }


    public function updateLocationName($locationName): void
    {
        $this->form->fill([
            'location_name' => $locationName,
        ]);
    }
}

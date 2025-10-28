<?php

namespace App\Filament\Resources\Questions\Pages;

use App\Filament\Resources\Questions\QuestionResource;
use Filament\Resources\Pages\CreateRecord;

class CreateQuestion extends CreateRecord
{
    protected static string $resource = QuestionResource::class;

    public function updateCoordinates($latitude, $longitude): void
    {
        $this->form->set('latitude', $latitude);
        $this->form->set('longitude', $longitude);
    }

   
    public function updateLocationName($locationName): void
    {
        $this->form->set('location_name', $locationName);
    }
}

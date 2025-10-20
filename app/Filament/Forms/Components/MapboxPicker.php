<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Field;

class MapboxPicker extends Field
{
    protected string $view = 'filament.forms.components.mapbox-picker';

  protected float $defaultLat = -8.1733;
protected float $defaultLng = 113.7031;
protected int $defaultZoom = 15; 
    protected string $accessToken = '';

    public function defaultLocation(float $lat, float $lng): static
    {
        $this->defaultLat = $lat;
        $this->defaultLng = $lng;
        return $this;
    }

    public function defaultZoom(int $zoom): static
    {
        $this->defaultZoom = $zoom;
        return $this;
    }

    public function accessToken(string $token): static
    {
        $this->accessToken = $token;
        return $this;
    }

    public function getDefaultLat(): float
    {
        return $this->defaultLat;
    }

    public function getDefaultLng(): float
    {
        return $this->defaultLng;
    }

    public function getDefaultZoom(): int
    {
        return $this->defaultZoom;
    }

    public function getAccessToken(): string
    {
        return $this->accessToken ?: env('MAPBOX_ACCESS_TOKEN');
    }
}

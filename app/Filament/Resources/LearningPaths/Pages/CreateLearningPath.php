<?php

namespace App\Filament\Resources\LearningPaths\Pages;

use App\Filament\Resources\LearningPaths\LearningPathResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLearningPath extends CreateRecord
{
    protected static string $resource = LearningPathResource::class;

    protected function getRedirectUrl(): string
    {
        // Setelah create, langsung ke Edit (tab Modul ada di sana)
        return LearningPathResource::getUrl('edit', ['record' => $this->record]);
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Learning Path berhasil dibuat! Tambahkan modul sekarang.';
    }
}
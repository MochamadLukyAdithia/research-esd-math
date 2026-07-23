<?php

namespace App\Filament\Resources\LearningPaths\Pages;

use App\Filament\Resources\LearningPaths\LearningPathResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use App\Helpers\NavigationHelper;
use Filament\Resources\Pages\EditRecord;

class EditLearningPath extends EditRecord
{
    protected static string $resource = LearningPathResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('toggle_publish')
                ->label(fn() => $this->record->is_published ? 'Sembunyikan' : 'Publikasikan')
                ->icon(fn() => $this->record->is_published ? 'heroicon-o-eye-slash' : 'heroicon-o-eye')
                ->color(fn() => $this->record->is_published ? 'warning' : 'success')
                ->visible(fn() => !NavigationHelper::isPengajar())
                ->requiresConfirmation()
                ->action(function () {
                    abort_if(NavigationHelper::isPengajar(), 403);
                    $this->record->update(['is_published' => !$this->record->is_published]);
                    $this->refreshFormData(['is_published']);
                }),

            DeleteAction::make()
                ->visible(fn() => !NavigationHelper::isPengajar()),
        ];
    }

    // Sembunyikan tombol Save & Cancel untuk pengajar (read-only)
    protected function getFormActions(): array
    {
        if (NavigationHelper::isPengajar()) {
            return [];
        }

        return parent::getFormActions();
    }

    // Cegah submit form manual (jaring pengaman kedua selain disabled() di form)
    protected function handleRecordUpdate($record, array $data): \Illuminate\Database\Eloquent\Model
    {
        abort_if(NavigationHelper::isPengajar(), 403);
        return parent::handleRecordUpdate($record, $data);
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Learning Path berhasil diperbarui';
    }
}
<?php

namespace App\Filament\Pages;

use App\Helpers\NavigationHelper;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public static function shouldRegisterNavigation(): bool
    {
        // Sembunyikan HANYA untuk question_only admin
        return !NavigationHelper::isQuestionOnlyAdmin();
    }

    public function mount(): void
    {
        // Redirect jika question_only admin coba akses dashboard
        if (NavigationHelper::isQuestionOnlyAdmin()) {
            redirect()->route('filament.admin.resources.questions.index');
        }
    }
}
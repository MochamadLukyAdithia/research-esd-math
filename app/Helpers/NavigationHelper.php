<?php

namespace App\Helpers;

use Filament\Facades\Filament;

class NavigationHelper
{
    public static function isQuestionOnlyAdmin(): bool
    {
        $user = Filament::auth()->user();
        
        if (!$user) {
            return false;
        }

        // Cek apakah user memiliki role "question_only"
        return $user->role === 'question_admin';
    }
}
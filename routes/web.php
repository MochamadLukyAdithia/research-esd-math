<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PortalForUserController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ])->name('home');
});

Route::middleware('auth', 'verified', 'role:user')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

Route::middleware('auth', 'verified', 'role:admin')->group(function () {});

Route::get('/about-us', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/tutorial', function () {
    return Inertia::render('Tutorial');
})->name('tutorial');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/portal', [PortalForUserController::class, 'index'])
        ->name('portal.index');
    Route::post('/portal/questions/{questionId}/toggle-favorite', [PortalForUserController::class, 'toggleFavorite'])
        ->name('portal.questions.toggleFavorite');
    Route::get('/portal/questions/{id}/detail', [PortalForUserController::class, 'getQuestionDetail'])
        ->name('portal.questions.detail');
    Route::post('/portal/questions/{id}/check-answer', [PortalForUserController::class, 'checkAnswer'])
        ->name('portal.questions.checkAnswer');
});

require __DIR__ . '/auth.php';

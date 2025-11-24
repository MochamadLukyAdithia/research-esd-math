<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PortalForUserController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'user' => Auth::user(),
    ]);
})->name('home');

Route::get('/about-us', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/tutorial', function () {
    return Inertia::render('Tutorial');
})->name('tutorial');

Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{id}', [NewsController::class, 'show'])->name('news.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware('auth', 'verified', 'role:user')->group(function () {
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

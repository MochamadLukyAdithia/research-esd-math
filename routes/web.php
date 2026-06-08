<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Application;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PortalForUserController;
use App\Http\Controllers\LearningPathController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
        'user'           => Auth::user(),
    ]);
})->name('home');

Route::get('/run-storage-link', function () {
    Artisan::call('storage:link');
    return 'storage link successfully';
});

Route::get('/about-us', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/tutorial', function () {
    return Inertia::render('Tutorial');
})->name('tutorial');

Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{id}', [NewsController::class, 'show'])->name('news.show');


/*
|--------------------------------------------------------------------------
| Profile (auth only)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});


/*
|--------------------------------------------------------------------------
| Portal (user only)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::prefix('portal')->name('portal.')->group(function () {
        Route::get('/', [PortalForUserController::class, 'index'])->name('index');

        Route::post('/questions/{questionId}/toggle-favorite', [PortalForUserController::class, 'toggleFavorite'])
            ->name('questions.toggleFavorite');

        Route::get('/questions/{id}/detail', [PortalForUserController::class, 'getQuestionDetail'])
            ->name('questions.detail');

        Route::post('/questions/{id}/check-answer', [PortalForUserController::class, 'checkAnswer'])
            ->name('questions.checkAnswer');
    });
});


/*
|--------------------------------------------------------------------------
| Learning Path
|--------------------------------------------------------------------------
| Public: view learning paths
| Auth: start & progress
|--------------------------------------------------------------------------
*/
 
Route::prefix('learningpath')->name('learningpath.')->group(function () {
 
    // Index: tampil per kelas
    Route::get('/', [LearningPathController::class, 'index'])->name('index');
 
    // Grade: daftar modul dalam satu kelas
    Route::get('/kelas/{grade}', [LearningPathController::class, 'grade'])
        ->name('grade')
        ->where('grade', '[0-9]+');
 
    // Detail modul (show stepper)
    Route::get('/{id}', [LearningPathController::class, 'show'])->name('show');
 
    // Protected: butuh login
    Route::middleware('auth')->group(function () {
        Route::post('/{id}/start', [LearningPathController::class, 'start'])->name('start');
 
        Route::prefix('/{pathId}/module/{moduleId}')->name('module.')->group(function () {
            Route::get('/',                  [LearningPathController::class, 'module'])->name('show');
            Route::post('/submit-answer',    [LearningPathController::class, 'submitAnswer'])->name('submit-answer');
            Route::post('/complete-material',[LearningPathController::class, 'completeMaterial'])->name('complete-material');
            Route::post('/submit-reflection',[LearningPathController::class, 'submitReflection'])->name('submit-reflection');
        });
 
        // Alias lama yang dipakai di tsx (learningpath.module)
        Route::get('/{pathId}/module/{moduleId}', [LearningPathController::class, 'module'])
            ->name('module');
 
        Route::get('/{pathId}/completion', [LearningPathController::class, 'completion'])->name('completion');
    });
});

require __DIR__.'/auth.php';
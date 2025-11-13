<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Api\QuestionController;
use Illuminate\Support\Facades\Route;


// use App\Http\Controllers\Api\QuestionApiController;

Route::prefix('v1')->group(function () {
    Route::get('/questions', [QuestionController::class, 'getAllQuestions']);
    Route::get('/questions/{id}', [QuestionController::class, 'getQuestionDetail']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/questions/{id}/check-answer', [QuestionController::class, 'checkAnswer']);
    });
    // Route::post('/questions/{id}/clear-attempts', [QuestionController::class, 'clearAttempts']);
    // Route::post('/questions/{id}/increment-attempts', [QuestionController::class, 'incrementAttempt']);
    // Route::post('/questions/{id}/check-cooldown', [QuestionController::class, 'checkCooldown']);
    // Route::get('/questions/{id}/attempt-info', [QuestionController::class, 'getAttemptInfo']);
});
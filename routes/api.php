<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\Api\QuestionApiController;

Route::prefix('v1')->group(function () {
    Route::apiResource('questions', QuestionApiController::class);
});
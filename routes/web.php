<?php

use App\Http\Controllers\MatchAnalyticController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::post('/parse-match-log', [MatchAnalyticController::class, 'parseMatchLog'])
    ->name('parse-match-log');
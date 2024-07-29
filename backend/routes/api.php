<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\metrics;
use App\Http\Controllers\NewRapportController;
use App\Http\Controllers\RapportR0Controller;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use App\Models\Rapport_R0;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// User related routes

Route::post('/register', [UserController::class, 'register']);
Route::get('/users', [UserController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);

Route::get('/metrics',[metrics::class,'calculateMetricsPerDay']);

// NewRapport related routes
Route::resource('new_rapports', RapportR0Controller::class);


// Sanctum routes
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

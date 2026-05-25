<?php

use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FineController;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\PublisherController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('users', UserController::class);
    Route::apiResource('publishers', PublisherController::class);
    Route::apiResource('authors', AuthorController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('members', MemberController::class);
    Route::apiResource('books', BookController::class);
    Route::apiResource('loans', LoanController::class);
    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('fines', FineController::class);
    Route::apiResource('settings', SettingController::class);
    Route::apiResource('audit-logs', AuditLogController::class)->only(['index', 'show']);
});

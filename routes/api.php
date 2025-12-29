<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Тестовые маршруты для паттерна Фасад (OrderFacade)
Route::prefix('test-order')->group(function () {
    Route::get('/success', [OrderController::class, 'testSuccessOrder']);
    Route::get('/out-of-stock', [OrderController::class, 'testOutOfStock']);
    Route::get('/payment-failed', [OrderController::class, 'testPaymentFailed']);
    Route::get('/cancel', [OrderController::class, 'testCancelOrder']);
});

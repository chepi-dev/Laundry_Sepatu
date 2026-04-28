<?php

use App\Http\Controllers\Api\AdminOrderController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LayananController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PembayaranController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OtpController;


// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::get('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


Route::post('/send-otp', [OtpController::class, 'sendOtp']);
Route::post('/verify-otp', [OtpController::class, 'verifyOtp']);

// Layanan
Route::get('/layanan',[LayananController::class, 'index']);
Route::get('/layanan/{id}',[LayananController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/layanan', [LayananController::class, 'store']);
    Route::put('/layanan/{id}', [LayananController::class, 'update']);
    Route::delete('/layanan/{id}', [LayananController::class, 'destroy']);
});

// Pembayaran
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders/{orderId}/pembayaran', [PembayaranController::class, 'store']);
    Route::get('/orders/{orderId}/pembayaran', [PembayaranController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::patch('/admin/orders/{orderId}/pembayaran/status', [PembayaranController::class, 'updateStatus']);
});

// Order Customer
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
});

//Admin
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/orders', [AdminOrderController::class, 'index']);
    Route::patch('/admin/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
});

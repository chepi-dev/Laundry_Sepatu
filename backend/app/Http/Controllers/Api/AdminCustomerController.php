<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index(){
        $customers = \App\Models\User::where('role', 'customer')->get();

        return response()->json([
            'message' => 'Semua data customer berhasil diambil',
            'data' => $customers
        ]);
    }
}

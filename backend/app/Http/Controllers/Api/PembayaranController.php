<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Order;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    public function show($orderId)
    {
        $pembayaran = Pembayaran::where('order_id', $orderId)->first();

        if (!$pembayaran) {
            return response()->json([
                'message' => 'Data pembayaran tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'data' => $pembayaran
        ]);
    }

    public function store(Request $request, $orderId)
    {
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json([
                'message' => 'Order tidak ditemukan'
            ], 404);
        }

        if ($order->pembayaran) {
            return response()->json([
                'message' => 'Pembayaran untuk order ini sudah ada'
            ], 400);
        }

        $validated = $request->validate([
            'metode_pembayaran' => 'required|string',
        ]);

        $pembayaran = Pembayaran::create([
            'order_id' => $order->id,
            'metode_pembayaran' => $validated['metode_pembayaran'],
            'status' => 'pending',
            'jumlah_bayar' => $order->total_harga,
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil dibuat',
            'data' => $pembayaran
        ], 201);
    }

    public function updateStatus(Request $request, $orderId)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,lunas,gagal',
        ]);

        $pembayaran = Pembayaran::where('order_id', $orderId)->first();

        if (!$pembayaran) {
            return response()->json([
                'message' => 'Data pembayaran tidak ditemukan'
            ], 404);
        }

        $dataUpdate = [
            'status' => $validated['status'],
        ];

        if ($validated['status'] === 'lunas') {
            $dataUpdate['tanggal_bayar'] = now();
        }

        $pembayaran->update($dataUpdate);

        return response()->json([
            'message' => 'Status pembayaran berhasil diupdate',
            'data' => $pembayaran
        ], 200);
    }
}
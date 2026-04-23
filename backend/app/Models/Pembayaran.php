<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $table = 'pembayarans';

    protected $fillable = [
    'order_id',
    'metode_pembayaran',
    'status',
    'jumlah_bayar',
    'tanggal_bayar',
    ];

    protected $casts = [
        'tanggal_bayar' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}

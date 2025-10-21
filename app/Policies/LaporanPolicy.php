<?php

namespace App\Policies;

use App\Models\Laporan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LaporanPolicy
{
    /**
     * Tentukan apakah user bisa mengupdate model.
     */
    public function update(User $user, Laporan $laporan): bool
    {
        // Izinkan jika ID user yang login SAMA DENGAN user_id di tabel laporan
        return $user->id === $laporan->user_id;
    }

    /**
     * Tentukan apakah user bisa menghapus model.
     */
    public function delete(User $user, Laporan $laporan): bool
    {
        // Logikanya sama dengan update
        return $user->id === $laporan->user_id;
    }

    // Anda bisa membiarkan fungsi lainnya kosong untuk saat ini
}
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Laporan;
use App\Policies\LaporanPolicy;

class AppServiceProvider extends ServiceProvider

{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // TAMBAHKAN BARIS INI:
        Laporan::class => LaporanPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void {}
}

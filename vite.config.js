if (typeof File === 'undefined') {
  global.File = class File {
    constructor(parts, name, options) {
      this.parts = parts;
      this.name = name;
      this.lastModified = options?.lastModified || Date.now();
      this.type = options?.type || '';
    }
  };
}

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import csp from 'vite-plugin-csp'; // <-- TAMBAHKAN IMPORT INI

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        // --- TAMBAHKAN BLOK KODE INI ---
        csp({
            policies: {
                'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            }
        })
        // --- BATAS AKHIR KODE TAMBAHAN ---
    ],
});
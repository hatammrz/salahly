import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
    server: {
        host: true,          // expose to network
        https: true,         // enable HTTPS
        port: 5173
    },

    plugins: [
        react(),
        basicSsl(),

        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
            manifest: {
                name: 'Salahly – Prayer & Qibla Companion',
                short_name: 'Salahly',
                description: 'Minimal Islamic prayer times and Qibla compass',
                theme_color: '#0B1220',
                background_color: '#0B1220',
                display: 'standalone',
                icons: [
                    {
                        src: 'icon.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any'
                    },
                    {
                        src: 'icon.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ]
})

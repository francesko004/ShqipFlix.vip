import { MetadataRoute } from 'next'


export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ShqipFlix - Filma dhe Seriale Shqip',
        short_name: 'ShqipFlix',
        description: 'Platforma lider shqiptare për transmetimin e filmave, serialeve dhe kanaleve Live TV në cilësi HD.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b0c15',
        theme_color: '#dc2626',
        orientation: 'portrait',
        categories: ['entertainment', 'movies', 'tv', 'streaming'],
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/favicon.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/favicon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
        shortcuts: [
            {
                name: 'Movies',
                url: '/movies',
                icons: [{ src: '/favicon.png', sizes: '192x192' }]
            },
            {
                name: 'TV Shows',
                url: '/tv',
                icons: [{ src: '/favicon.png', sizes: '192x192' }]
            },
            {
                name: 'Live TV',
                url: '/live',
                icons: [{ src: '/favicon.png', sizes: '192x192' }]
            }
        ]
    }
}

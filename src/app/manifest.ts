import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ShqipFlix - Streaming Shqip',
        short_name: 'ShqipFlix',
        description: 'Platforma më e mirë shqiptare për të parë filma dhe seriale online falas',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b0c15',
        theme_color: '#dc2626',
        icons: [
            {
                src: '/favicon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://shqipflix.vip'


    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/movies`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tv`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/new`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/live`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/support`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/advertise`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ]

    // Dynamic movie/TV routes from database
    try {
        const mediaContent = await prisma.mediaContent.findMany({
            where: { isVisible: true },
            select: {
                id: true,
                mediaType: true,
                updatedAt: true,
                popularity: true,
            },
            orderBy: { popularity: 'desc' },
            take: 2000,
        })

        const dynamicRoutes: MetadataRoute.Sitemap = mediaContent.map((item) => ({
            url: `${baseUrl}/${item.mediaType}/${item.id}`,
            lastModified: item.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: item.popularity && item.popularity > 50 ? 0.8 : 0.6,
        }))

        return [...staticRoutes, ...dynamicRoutes]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        return staticRoutes
    }
}

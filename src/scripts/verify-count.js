const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.mediaContent.count();
    const movies = await prisma.mediaContent.count({ where: { mediaType: 'movie' } });
    const tv = await prisma.mediaContent.count({ where: { mediaType: 'tv' } });

    console.log(`Total Media: ${count}`);
    console.log(`Movies: ${movies}`);
    console.log(`TV Shows: ${tv}`);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding sample live channels...");

    const channels = [
        {
            name: "SuperSport 1 HD",
            category: "Sports",
            streamUrl: "https://example.com/stream1", // Placeholder
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/SuperSport_Logo.svg/1024px-SuperSport_Logo.svg.png",
            isIframe: true,
        },
        {
            name: "SuperSport 2 HD",
            category: "Sports",
            streamUrl: "https://example.com/stream2", // Placeholder
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/SuperSport_Logo.svg/1024px-SuperSport_Logo.svg.png",
            isIframe: true,
        },
        {
            name: "EuroSport 1",
            category: "Sports",
            streamUrl: "https://example.com/eurosport1", // Placeholder
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Eurosport_logo_2015.svg/1200px-Eurosport_logo_2015.svg.png",
            isIframe: true,
        },
        {
            name: "CNN International",
            category: "News",
            streamUrl: "https://example.com/cnn", // Placeholder
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/1200px-CNN_International_logo.svg.png",
            isIframe: true,
        },
        {
            name: "BBC World News",
            category: "News",
            streamUrl: "https://example.com/bbc", // Placeholder
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_World_News_2022.svg/1200px-BBC_World_News_2022.svg.png",
            isIframe: true,
        }
    ];

    for (const channel of channels) {
        await (prisma as any).liveChannel.upsert({
            where: { id: channel.name.toLowerCase().replace(/\s+/g, '-') }, // Simple ID generation for seeding
            update: channel,
            create: {
                id: channel.name.toLowerCase().replace(/\s+/g, '-'),
                ...channel,
            }
        });
        console.log(`- Upserted ${channel.name}`);
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

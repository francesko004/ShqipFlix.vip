import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get a random active bumper ad
        const ads = await prisma.bumperAd.findMany({
            where: { isActive: true },
        });

        if (ads.length === 0) {
            return NextResponse.json({ ad: null });
        }

        // Select random ad
        const randomAd = ads[Math.floor(Math.random() * ads.length)];

        // Increment impressions
        await prisma.bumperAd.update({
            where: { id: randomAd.id },
            data: { impressions: { increment: 1 } },
        });

        return NextResponse.json({ ad: randomAd });
    } catch (error) {
        console.error("Error fetching bumper ad:", error);
        return NextResponse.json({ ad: null });
    }
}

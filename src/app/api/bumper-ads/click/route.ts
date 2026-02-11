import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { adId } = await req.json();

        if (!adId) {
            return NextResponse.json({ error: "Ad ID required" }, { status: 400 });
        }

        // Increment click count
        await prisma.bumperAd.update({
            where: { id: adId },
            data: { clicks: { increment: 1 } },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking ad click:", error);
        return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
    }
}

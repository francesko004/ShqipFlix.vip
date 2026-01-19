import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const channels = await (prisma as any).liveChannel.findMany({
            where: { isVisible: true },
            orderBy: { name: "asc" },
        });

        // Group channels by category
        const categories = [...new Set(channels.map((c: any) => c.category as string))];
        const groupedChannels = categories.map((category) => ({
            category: category as string,
            channels: channels.filter((c: any) => c.category === category)
        }));

        return NextResponse.json({ groupedChannels });
    } catch (error) {
        console.error("Error fetching live channels:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

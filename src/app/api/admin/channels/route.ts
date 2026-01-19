import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch all live channels
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const channels = await (prisma as any).liveChannel.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ channels });
    } catch (error) {
        console.error("Error fetching live channels:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Add a new live channel
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, category, streamUrl, isIframe, logo, userAgent, referer } = body;

        if (!name || !category || !streamUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newChannel = await (prisma as any).liveChannel.create({
            data: {
                name,
                category,
                streamUrl,
                isIframe: isIframe ?? true,
                logo,
                userAgent,
                referer,
            },
        });

        return NextResponse.json({ channel: newChannel });
    } catch (error) {
        console.error("Error creating live channel:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT: Update a live channel
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, name, category, streamUrl, isIframe, logo, userAgent, referer, isVisible } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const updatedChannel = await (prisma as any).liveChannel.update({
            where: { id },
            data: {
                name,
                category,
                streamUrl,
                isIframe,
                logo,
                userAgent,
                referer,
                isVisible,
            },
        });

        return NextResponse.json({ channel: updatedChannel });
    } catch (error) {
        console.error("Error updating live channel:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: Remove a live channel
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await (prisma as any).liveChannel.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting live channel:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

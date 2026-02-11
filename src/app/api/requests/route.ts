import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description } = await req.json();

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const request = await prisma.movieRequest.create({
            data: {
                userId: session.user.id,
                title,
                description: description || null,
                status: "PENDING",
            },
        });

        return NextResponse.json({ success: true, request });
    } catch (error) {
        console.error("Error creating movie request:", error);
        return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const requests = await prisma.movieRequest.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error("Error fetching movie requests:", error);
        return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
    }
}

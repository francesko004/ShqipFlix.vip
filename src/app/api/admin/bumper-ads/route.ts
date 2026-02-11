import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all bumper ads (admin only)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ads = await prisma.bumperAd.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ ads });
    } catch (error) {
        console.error("Error fetching bumper ads:", error);
        return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
    }
}

// PATCH to toggle active status
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, isActive } = await req.json();

        const ad = await prisma.bumperAd.update({
            where: { id },
            data: { isActive },
        });

        return NextResponse.json({ success: true, ad });
    } catch (error) {
        console.error("Error updating bumper ad:", error);
        return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
    }
}

// DELETE bumper ad
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();

        await prisma.bumperAd.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting bumper ad:", error);
        return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
    }
}

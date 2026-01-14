
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch all crypto addresses
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const addresses = await prisma.cryptoAddress.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ addresses });
    } catch (error) {
        console.error("Error fetching crypto addresses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Add a new crypto address
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, symbol, address, network } = body;

        if (!name || !symbol || !address) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newAddress = await prisma.cryptoAddress.create({
            data: {
                name,
                symbol,
                address,
                network,
            },
        });

        return NextResponse.json({ address: newAddress });
    } catch (error) {
        console.error("Error creating crypto address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT: Update a crypto address
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, name, symbol, address, network, isVisible } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const updatedAddress = await prisma.cryptoAddress.update({
            where: { id },
            data: {
                name,
                symbol,
                address,
                network,
                isVisible,
            },
        });

        return NextResponse.json({ address: updatedAddress });
    } catch (error) {
        console.error("Error updating crypto address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: Remove a crypto address
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

        await prisma.cryptoAddress.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting crypto address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

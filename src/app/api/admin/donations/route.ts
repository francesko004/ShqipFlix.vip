import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const donations = await prisma.donation.findMany({
            orderBy: {
                donatedAt: "desc",
            },
        });

        const stats = await prisma.donation.aggregate({
            _sum: {
                amount: true,
            },
            _count: true,
        });

        return NextResponse.json({
            donations,
            stats: {
                totalAmount: stats._sum.amount || 0,
                totalDonors: stats._count,
            },
        });
    } catch (error) {
        console.error("Error fetching donations:", error);
        return NextResponse.json(
            { error: "Failed to fetch donations" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { donorName, amount, message, donatedAt } = body;

        if (!donorName || !amount) {
            return NextResponse.json(
                { error: "Donor name and amount are required" },
                { status: 400 }
            );
        }

        const donation = await prisma.donation.create({
            data: {
                donorName,
                amount: parseFloat(amount),
                message: message || null,
                donatedAt: donatedAt ? new Date(donatedAt) : new Date(),
            },
        });

        return NextResponse.json(donation);
    } catch (error) {
        console.error("Error creating donation:", error);
        return NextResponse.json(
            { error: "Failed to create donation" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, donorName, amount, message, isVisible, donatedAt } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Donation ID is required" },
                { status: 400 }
            );
        }

        const donation = await prisma.donation.update({
            where: { id },
            data: {
                ...(donorName && { donorName }),
                ...(amount && { amount: parseFloat(amount) }),
                ...(message !== undefined && { message }),
                ...(isVisible !== undefined && { isVisible }),
                ...(donatedAt && { donatedAt: new Date(donatedAt) }),
            },
        });

        return NextResponse.json(donation);
    } catch (error) {
        console.error("Error updating donation:", error);
        return NextResponse.json(
            { error: "Failed to update donation" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Donation ID is required" },
                { status: 400 }
            );
        }

        await prisma.donation.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting donation:", error);
        return NextResponse.json(
            { error: "Failed to delete donation" },
            { status: 500 }
        );
    }
}

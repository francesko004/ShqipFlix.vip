import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const donations = await prisma.donation.findMany({
            where: {
                isVisible: true,
            },
            orderBy: {
                amount: "desc",
            },
            select: {
                id: true,
                donorName: true,
                amount: true,
                message: true,
                donatedAt: true,
            },
        });

        const stats = await prisma.donation.aggregate({
            where: {
                isVisible: true,
            },
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

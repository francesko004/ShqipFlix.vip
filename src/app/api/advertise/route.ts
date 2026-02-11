import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { advertiser, contactEmail, mediaUrl, clickUrl, duration } = await req.json();

        if (!advertiser || !contactEmail || !mediaUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const ad = await prisma.bumperAd.create({
            data: {
                advertiser,
                contactEmail,
                mediaUrl,
                clickUrl: clickUrl || null,
                duration: duration || 5,
                isActive: false, // Requires admin approval
            },
        });

        return NextResponse.json({ success: true, ad });
    } catch (error) {
        console.error("Error creating ad submission:", error);
        return NextResponse.json(
            { error: "Failed to submit ad" },
            { status: 500 }
        );
    }
}

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const username = body.username?.trim();
        const password = body.password;

        if (!username || !password) {
            return NextResponse.json(
                { message: "Missing username or password" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Username already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: "USER"
            }
        });

        return NextResponse.json(
            { message: "User created successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { validatePassword } from "@/lib/password-validation";

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

        // Server-side password validation
        const pwdValidation = validatePassword(password);
        if (!pwdValidation.isValid) {
            return NextResponse.json(
                { message: pwdValidation.error },
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
        // Log internally, but don't expose to client
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

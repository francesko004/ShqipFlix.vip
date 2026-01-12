import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    try {
        const hashedPassword = await bcrypt.hash("password123", 10);

        console.log("Creating admin user...");
        await prisma.user.upsert({
            where: { username: "admin" },
            update: {
                role: "ADMIN",
                password: hashedPassword
            },
            create: {
                username: "admin",
                password: hashedPassword,
                role: "ADMIN"
            }
        });
        console.log("Admin user created.");

        console.log("Creating test user...");
        await prisma.user.upsert({
            where: { username: "testuser" },
            update: {
                role: "USER",
                password: hashedPassword
            },
            create: {
                username: "testuser",
                password: hashedPassword,
                role: "USER"
            }
        });
        console.log("Test user created.");

    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

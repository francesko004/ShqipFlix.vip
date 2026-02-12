"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }
    return session;
}

export async function updateMessageStatus(messageId: string, status: "PENDING" | "READ" | "REPLIED") {
    try {
        await ensureAdmin();

        await prisma.contactMessage.update({
            where: { id: messageId },
            data: { status }
        });

        revalidatePath("/admin/support");
        return { success: true };
    } catch (error) {
        console.error("Update message status error:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function deleteMessage(messageId: string) {
    try {
        await ensureAdmin();

        await prisma.contactMessage.delete({
            where: { id: messageId }
        });

        revalidatePath("/admin/support");
        return { success: true };
    } catch (error) {
        console.error("Delete message error:", error);
        return { success: false, error: "Failed to delete message" };
    }
}

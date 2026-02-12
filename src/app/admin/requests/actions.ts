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

/**
 * Updates the status of a movie request.
 */
export async function updateRequestStatus(requestId: string, status: "PENDING" | "APPROVED" | "REJECTED" | "ADDED") {
    try {
        await ensureAdmin();

        await prisma.movieRequest.update({
            where: { id: requestId },
            data: { status }
        });

        revalidatePath("/admin/requests");
        return { success: true };
    } catch (error) {
        console.error("Update request status error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update request status" };
    }
}

/**
 * Deletes a movie request.
 */
export async function deleteRequest(requestId: string) {
    try {
        await ensureAdmin();

        await prisma.movieRequest.delete({
            where: { id: requestId }
        });

        revalidatePath("/admin/requests");
        return { success: true };
    } catch (error) {
        console.error("Delete request error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete request" };
    }
}

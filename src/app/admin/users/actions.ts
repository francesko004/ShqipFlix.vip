"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Ensures the current requester is an admin.
 */
async function ensureAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }
    return session;
}

/**
 * Deletes a user by ID.
 * Prevents admins from deleting themselves.
 */
export async function deleteUser(userId: string) {
    try {
        const session = await ensureAdmin();

        if (session.user.id === userId) {
            return { success: false, error: "You cannot delete your own account" };
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Delete user error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" };
    }
}

/**
 * Toggles a user's role between USER and ADMIN.
 */
export async function toggleUserRole(userId: string) {
    try {
        const session = await ensureAdmin();

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, id: true }
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Prevent admin from demoting themselves (to avoid lockouts)
        if (session.user.id === userId && user.role === "ADMIN") {
            return { success: false, error: "You cannot demote yourself" };
        }

        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });

        revalidatePath("/admin/users");
        return { success: true, newRole };
    } catch (error) {
        console.error("Toggle user role error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to change user role" };
    }
}

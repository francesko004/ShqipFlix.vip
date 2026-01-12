"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleVisibility(id: number, current: boolean) {
    try {
        await prisma.mediaContent.update({
            where: { id },
            data: { isVisible: !current }
        });
        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle visibility:", error);
        return { success: false, error: "Failed to update visibility" };
    }
}

export async function toggleFeatured(id: number, current: boolean) {
    try {
        // Optional: Ensure only a few items are featured if needed, but for now just toggle
        await prisma.mediaContent.update({
            where: { id },
            data: { isFeatured: !current }
        });
        revalidatePath("/admin/content");
        revalidatePath("/"); // Update home page since featured items might be there
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle featured:", error);
        return { success: false, error: "Failed to update featured status" };
    }
}

export async function deleteMedia(id: number) {
    try {
        await prisma.mediaContent.delete({
            where: { id }
        });
        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete media:", error);
        return { success: false, error: "Failed to delete item" };
    }
}

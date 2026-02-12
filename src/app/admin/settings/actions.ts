
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
    try {
        let settings = await prisma.globalSettings.findFirst();
        if (!settings) {
            settings = await prisma.globalSettings.create({
                data: {}
            });
        }
        return settings;
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return null;
    }
}

export async function updateSettings(data: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    logoUrl?: string;
    adFrequency: number;
    maintenanceMode: boolean
}) {
    try {
        const first = await prisma.globalSettings.findFirst();
        let id = 1;

        if (first) {
            id = first.id;
        }

        await prisma.globalSettings.upsert({
            where: { id },
            update: {
                siteName: data.siteName,
                siteDescription: data.siteDescription,
                supportEmail: data.supportEmail,
                logoUrl: data.logoUrl,
                adFrequency: data.adFrequency,
                maintenanceMode: data.maintenanceMode,
            },
            create: {
                siteName: data.siteName,
                siteDescription: data.siteDescription,
                supportEmail: data.supportEmail,
                logoUrl: data.logoUrl,
                adFrequency: data.adFrequency,
                maintenanceMode: data.maintenanceMode,
            }
        });

        revalidatePath("/admin/settings");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}

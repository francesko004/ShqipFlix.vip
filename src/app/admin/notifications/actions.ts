"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendMassNotification(data: {
    title: string;
    message: string;
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
}) {
    try {
        // Get all users
        const users = await prisma.user.findMany({
            select: { id: true }
        });

        // Create notification for each user
        await prisma.notification.createMany({
            data: users.map((user: { id: string }) => ({
                userId: user.id,
                title: data.title,
                message: data.message,
                type: data.type,
            }))
        });

        revalidatePath("/admin/notifications");
        return { success: true, count: users.length };
    } catch (error) {
        console.error("Error sending mass notification:", error);
        return { success: false, error: "Failed to send notification" };
    }
}

export async function getNotifications(userId: string) {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 50
        });
        return notifications;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}

export async function getUnreadCount(userId: string) {
    try {
        const count = await prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        });
        return count;
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0;
    }
}

export async function markAsRead(notificationId: string) {
    try {
        await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
        revalidatePath("/notifications");
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false };
    }
}

export async function markAllAsRead(userId: string) {
    try {
        await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: { isRead: true }
        });
        revalidatePath("/notifications");
        return { success: true };
    } catch (error) {
        console.error("Error marking all as read:", error);
        return { success: false };
    }
}

export async function deleteNotification(notificationId: string) {
    try {
        await prisma.notification.delete({
            where: { id: notificationId }
        });
        revalidatePath("/notifications");
        return { success: true };
    } catch (error) {
        console.error("Error deleting notification:", error);
        return { success: false };
    }
}

export async function getRecentNotifications() {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        });
        return notifications;
    } catch (error) {
        console.error("Error fetching recent notifications:", error);
        return [];
    }
}

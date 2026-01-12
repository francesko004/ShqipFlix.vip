"use client";

import { Bell, X, CheckCircle, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export function NotificationBell({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, [userId]);

    async function fetchNotifications() {
        try {
            const response = await fetch(`/api/notifications?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }

    async function markAsRead(notificationId: string) {
        try {
            await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId })
            });
            fetchNotifications();
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    }

    function getIcon(type: string) {
        switch (type) {
            case "SUCCESS": return CheckCircle;
            case "WARNING": return AlertTriangle;
            case "ERROR": return AlertCircle;
            default: return Info;
        }
    }

    function getColor(type: string) {
        switch (type) {
            case "SUCCESS": return "text-green-500";
            case "WARNING": return "text-yellow-500";
            case "ERROR": return "text-red-500";
            default: return "text-blue-500";
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-[#0b0c15] border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h3 className="font-bold">Notifications</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/5 rounded transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">
                                    Loading...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No notifications
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.slice(0, 5).map((notification) => {
                                        const Icon = getIcon(notification.type);
                                        const colorClass = getColor(notification.type);

                                        return (
                                            <div
                                                key={notification.id}
                                                className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notification.isRead ? "bg-white/5" : ""
                                                    }`}
                                                onClick={() => {
                                                    if (!notification.isRead) {
                                                        markAsRead(notification.id);
                                                    }
                                                }}
                                            >
                                                <div className="flex gap-3">
                                                    <Icon className={`w-5 h-5 ${colorClass} flex-shrink-0 mt-0.5`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-sm truncate">
                                                                {notification.title}
                                                            </h4>
                                                            {!notification.isRead && (
                                                                <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-white/10">
                                <Link
                                    href="/notifications"
                                    className="block text-center text-sm text-red-500 hover:text-red-400 font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

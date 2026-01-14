import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getNotifications, markAllAsRead } from "@/app/admin/notifications/actions";
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const notifications = await getNotifications(session.user.id);

    async function handleMarkAllAsRead() {
        "use server";
        const session = await getServerSession(authOptions);
        if (session) {
            await markAllAsRead(session.user.id);
            revalidatePath("/notifications");
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

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Bell className="w-8 h-8 text-red-500" />
                            Notifications
                        </h1>
                        <p className="text-gray-400 mt-2">
                            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <form action={handleMarkAllAsRead}>
                            <button
                                type="submit"
                                className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-white/10"
                            >
                                Mark all as read
                            </button>
                        </form>
                    )}
                </div>

                <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <div className="bg-[#0b0c15] border border-white/5 rounded-xl p-12 text-center">
                            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-400 mb-2">No notifications yet</h3>
                            <p className="text-gray-500">We&apos;ll notify you when something important happens</p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const Icon = getIcon(notification.type);
                            const colorClass = getColor(notification.type);

                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-[#0b0c15] border rounded-xl p-6 transition-all hover:border-white/20 ${notification.isRead ? "border-white/5" : "border-red-600/20 bg-red-600/5"
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        <Icon className={`w-6 h-6 ${colorClass} flex-shrink-0 mt-1`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="font-bold text-lg flex items-center gap-2">
                                                    {notification.title}
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
                                                    )}
                                                </h3>
                                                <span className="text-sm text-gray-500 flex-shrink-0">
                                                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-gray-400">{notification.message}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

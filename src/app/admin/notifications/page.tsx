import { Bell, Send, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { sendMassNotification, getRecentNotifications } from "./actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
    const recentNotifications = await getRecentNotifications();

    async function handleSendNotification(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        const message = formData.get("message") as string;
        const type = formData.get("type") as "INFO" | "WARNING" | "SUCCESS" | "ERROR";

        await sendMassNotification({ title, message, type });
        revalidatePath("/admin/notifications");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Bell className="w-6 h-6 text-red-500" />
                        Mass Notifications
                    </h2>
                    <p className="text-gray-400">Send notifications to all users</p>
                </div>
            </div>

            {/* Send Notification Form */}
            <div className="bg-[#0b0c15] border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Send New Notification</h3>
                <form action={handleSendNotification} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            placeholder="e.g., New Features Available"
                            className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Message</label>
                        <textarea
                            name="message"
                            required
                            rows={4}
                            placeholder="Enter your notification message..."
                            className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Type</label>
                        <select
                            name="type"
                            required
                            className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
                        >
                            <option value="INFO">Info</option>
                            <option value="SUCCESS">Success</option>
                            <option value="WARNING">Warning</option>
                            <option value="ERROR">Error</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-bold"
                    >
                        <Send className="w-4 h-4" />
                        Send to All Users
                    </button>
                </form>
            </div>

            {/* Recent Notifications */}
            <div className="bg-[#0b0c15] border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Recent Notifications</h3>
                <div className="space-y-3">
                    {recentNotifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No notifications sent yet</p>
                    ) : (
                        recentNotifications.map((notification) => {
                            const Icon =
                                notification.type === "SUCCESS" ? CheckCircle :
                                    notification.type === "WARNING" ? AlertTriangle :
                                        notification.type === "ERROR" ? AlertCircle :
                                            Info;

                            const colorClass =
                                notification.type === "SUCCESS" ? "text-green-500" :
                                    notification.type === "WARNING" ? "text-yellow-500" :
                                        notification.type === "ERROR" ? "text-red-500" :
                                            "text-blue-500";

                            return (
                                <div
                                    key={notification.id}
                                    className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <Icon className={`w-5 h-5 ${colorClass} flex-shrink-0 mt-0.5`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h4 className="font-bold truncate">{notification.title}</h4>
                                                <span className="text-xs text-gray-500 flex-shrink-0">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400">{notification.message}</p>
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

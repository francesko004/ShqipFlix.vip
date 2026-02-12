import { prisma } from "@/lib/prisma";
import { MessageSquare } from "lucide-react";
import { MessageTable } from "@/components/admin/MessageTable";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-red-500" />
                        Support Tickets
                    </h2>
                    <p className="text-gray-400">View and manage support messages from the contact form</p>
                </div>
            </div>

            <MessageTable initialMessages={JSON.parse(JSON.stringify(messages))} />
        </div>
    );
}

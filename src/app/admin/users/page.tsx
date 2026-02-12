import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import { UserTable } from "@/components/admin/UserTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 100 // Increased take for a better admin experience
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-red-500" />
                        Users Management
                    </h2>
                    <p className="text-gray-400">View and manage registered users</p>
                </div>
            </div>

            <UserTable
                initialUsers={JSON.parse(JSON.stringify(users))}
                currentUserId={session?.user?.id || ""}
            />
        </div>
    );
}

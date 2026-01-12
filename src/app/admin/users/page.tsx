
import { prisma } from "@/lib/prisma";
import { User as PrismaUser } from "@prisma/client";
import { Users, Search, MoreVertical, Shield, User } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 50
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

            <div className="bg-[#0b0c15] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-[#050505] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-gray-400">
                            <th className="p-4 font-medium">Username</th>
                            <th className="p-4 font-medium">Role</th>
                            <th className="p-4 font-medium">Joined</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user: PrismaUser) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-gray-400" />
                                    </div>
                                    {user.username}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === "ADMIN" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                                <td className="p-4 text-right">
                                    <button className="text-gray-500 hover:text-white transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

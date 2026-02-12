"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, MoreVertical, Shield, User, Trash2, ShieldAlert, ShieldCheck } from "lucide-react";
import { deleteUser, toggleUserRole } from "@/app/admin/users/actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserTableProps {
    initialUsers: any[];
    currentUserId: string;
}

export function UserTable({ initialUsers, currentUserId }: UserTableProps) {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        setIsProcessing(userId);
        const result = await deleteUser(userId);
        if (result.success) {
            setUsers(users.filter((u) => u.id !== userId));
        } else {
            alert(result.error);
        }
        setIsProcessing(null);
    };

    const handleToggleRole = async (userId: string) => {
        setIsProcessing(userId);
        const result = await toggleUserRole(userId);
        if (result.success) {
            setUsers(
                users.map((u) =>
                    u.id === userId ? { ...u, role: result.newRole } : u
                )
            );
        } else {
            alert(result.error);
        }
        setIsProcessing(null);
    };

    return (
        <div className="bg-[#0b0c15] border border-white/5 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
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
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className={`hover:bg-white/5 transition-colors ${isProcessing === user.id ? "opacity-50 pointer-events-none" : ""}`}>
                                <td className="p-4 font-medium text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span>{user.username}</span>
                                        {user.id === currentUserId && (
                                            <span className="text-[10px] text-red-500 font-bold uppercase">You</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.role === "ADMIN" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                                <td className="p-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#0b0c15] border-white/10 text-gray-300">
                                            <DropdownMenuItem
                                                onClick={() => handleToggleRole(user.id)}
                                                className="hover:bg-white/5 cursor-pointer flex items-center gap-2"
                                                disabled={user.id === currentUserId && user.role === "ADMIN"}
                                            >
                                                {user.role === "ADMIN" ? (
                                                    <><ShieldAlert className="w-4 h-4 text-blue-500" /> Demote to User</>
                                                ) : (
                                                    <><ShieldCheck className="w-4 h-4 text-red-500" /> Promote to Admin</>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(user.id)}
                                                className="hover:bg-red-500/10 text-red-500 cursor-pointer flex items-center gap-2"
                                                disabled={user.id === currentUserId}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="p-12 text-center text-gray-500 italic">
                    No users found matching your search.
                </div>
            )}
        </div>
    );
}

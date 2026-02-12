"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, User, Trash2, CheckCircle2, Clock, MessageSquare, MoreVertical, Eye } from "lucide-react";
import { updateMessageStatus, deleteMessage } from "@/app/admin/support/actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageTableProps {
    initialMessages: any[];
}

export function MessageTable({ initialMessages }: MessageTableProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleUpdateStatus = async (messageId: string, status: any) => {
        setIsProcessing(messageId);
        const result = await updateMessageStatus(messageId, status);
        if (result.success) {
            setMessages(
                messages.map((m) =>
                    m.id === messageId ? { ...m, status } : m
                )
            );
        } else {
            alert(result.error);
        }
        setIsProcessing(null);
    };

    const handleDelete = async (messageId: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        setIsProcessing(messageId);
        const result = await deleteMessage(messageId);
        if (result.success) {
            setMessages(messages.filter((m) => m.id !== messageId));
        } else {
            alert(result.error);
        }
        setIsProcessing(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-500/10 text-yellow-500";
            case "READ": return "bg-blue-500/10 text-blue-500";
            case "REPLIED": return "bg-green-500/10 text-green-500";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    return (
        <div className="bg-[#0b0c15] border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-gray-400">
                            <th className="p-4 font-medium">From / Subject</th>
                            <th className="p-4 font-medium">Message</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {messages.map((msg) => (
                            <tr key={msg.id} className={`hover:bg-white/5 transition-colors ${isProcessing === msg.id ? "opacity-50 pointer-events-none" : ""}`}>
                                <td className="p-4 min-w-[200px]">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white">{msg.name}</span>
                                        <span className="text-xs text-gray-500">{msg.email}</span>
                                        <span className="text-xs text-red-500 font-medium mt-1">{msg.subject}</span>
                                    </div>
                                </td>
                                <td className="p-4 min-w-[300px]">
                                    <p className="text-gray-300 line-clamp-2 text-xs leading-relaxed">
                                        {msg.message}
                                    </p>
                                </td>
                                <td className="p-4 text-gray-400 whitespace-nowrap">
                                    {format(new Date(msg.createdAt), "MMM d, yyyy")}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(msg.status)}`}>
                                        {msg.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#0b0c15] border-white/10 text-gray-300">
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(msg.id, "READ")} className="hover:bg-white/5 cursor-pointer flex items-center gap-2">
                                                <Eye className="w-4 h-4" /> Mark as Read
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(msg.id, "REPLIED")} className="hover:bg-white/5 cursor-pointer flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" /> Mark as Replied
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(msg.id, "PENDING")} className="hover:bg-white/5 cursor-pointer flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> Set to Pending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(msg.id)} className="hover:bg-red-500/10 text-red-500 cursor-pointer flex items-center gap-2 border-t border-white/5">
                                                <Trash2 className="w-4 h-4" /> Delete Message
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500 italic">
                                    No support messages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

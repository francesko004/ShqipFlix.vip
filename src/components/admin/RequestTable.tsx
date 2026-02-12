"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Film, User, Trash2, CheckCircle2, Clock, XCircle, MoreVertical } from "lucide-react";
import { updateRequestStatus, deleteRequest } from "@/app/admin/requests/actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RequestTableProps {
    initialRequests: any[];
}

export function RequestTable({ initialRequests }: RequestTableProps) {
    const [requests, setRequests] = useState(initialRequests);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleUpdateStatus = async (requestId: string, status: any) => {
        setIsProcessing(requestId);
        const result = await updateRequestStatus(requestId, status);
        if (result.success) {
            setRequests(
                requests.map((r) =>
                    r.id === requestId ? { ...r, status } : r
                )
            );
        } else {
            alert(result.error);
        }
        setIsProcessing(requestId === null ? null : null); // Trigger re-render if needed
        setIsProcessing(null);
    };

    const handleDelete = async (requestId: string) => {
        if (!confirm("Are you sure you want to delete this request?")) return;

        setIsProcessing(requestId);
        const result = await deleteRequest(requestId);
        if (result.success) {
            setRequests(requests.filter((r) => r.id !== requestId));
        } else {
            alert(result.error);
        }
        setIsProcessing(null);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING": return <Clock className="w-3 h-3 text-yellow-500" />;
            case "APPROVED": return <CheckCircle2 className="w-3 h-3 text-green-500" />;
            case "REJECTED": return <XCircle className="w-3 h-3 text-red-500" />;
            case "ADDED": return <Film className="w-3 h-3 text-blue-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-500/10 text-yellow-500";
            case "APPROVED": return "bg-green-500/10 text-green-500";
            case "REJECTED": return "bg-red-500/10 text-red-500";
            case "ADDED": return "bg-blue-500/10 text-blue-500";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    return (
        <div className="bg-[#0b0c15] border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-gray-400">
                            <th className="p-4 font-medium">Title</th>
                            <th className="p-4 font-medium">Requested By</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {requests.map((req) => (
                            <tr key={req.id} className={`hover:bg-white/5 transition-colors ${isProcessing === req.id ? "opacity-50 pointer-events-none" : ""}`}>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white">{req.title}</span>
                                        {req.description && (
                                            <span className="text-xs text-gray-500 line-clamp-1">{req.description}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-gray-500" />
                                        <span className="text-gray-300">{req.user.username}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-400">{format(new Date(req.createdAt), "MMM d, yyyy")}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(req.status)}`}>
                                        {getStatusIcon(req.status)}
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#0b0c15] border-white/10 text-gray-300">
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, "APPROVED")} className="hover:bg-white/5 cursor-pointer text-green-500">
                                                Approve Request
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, "ADDED")} className="hover:bg-white/5 cursor-pointer text-blue-500">
                                                Mark as Added
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, "REJECTED")} className="hover:bg-white/5 cursor-pointer text-red-500/70">
                                                Reject Request
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, "PENDING")} className="hover:bg-white/5 cursor-pointer text-yellow-500">
                                                Set to Pending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(req.id)} className="hover:bg-red-500/10 text-red-500 cursor-pointer border-t border-white/5">
                                                Delete Request
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500 italic">
                                    No movie requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

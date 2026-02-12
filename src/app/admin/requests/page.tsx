import { prisma } from "@/lib/prisma";
import { Film } from "lucide-react";
import { RequestTable } from "@/components/admin/RequestTable";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
    const requests = await prisma.movieRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    username: true
                }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Film className="w-6 h-6 text-red-500" />
                        Movie Requests
                    </h2>
                    <p className="text-gray-400">Review and manage content requests from users</p>
                </div>
            </div>

            <RequestTable initialRequests={JSON.parse(JSON.stringify(requests))} />
        </div>
    );
}

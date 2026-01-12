
import { Settings, Save } from "lucide-react";
import { getSettings, updateSettings } from "./actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
    const settings = await getSettings();

    async function saveSettings(formData: FormData) {
        "use server";
        const siteName = formData.get("siteName") as string;
        const supportEmail = formData.get("supportEmail") as string;
        const maintenanceMode = formData.get("maintenanceMode") === "on";

        await updateSettings({
            siteName,
            supportEmail,
            maintenanceMode
        });

        revalidatePath("/admin/settings");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Settings className="w-6 h-6 text-red-500" />
                        Site Settings
                    </h2>
                    <p className="text-gray-400">Manage global application settings</p>
                </div>
            </div>

            <form action={saveSettings} className="grid gap-6">
                <div className="bg-[#0b0c15] border border-white/5 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">General Configuration</h3>
                        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-bold">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                    <div className="grid gap-4 max-w-xl">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Site Name</label>
                            <input
                                name="siteName"
                                type="text"
                                defaultValue={settings?.siteName || "ShqipFlix"}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Support Email</label>
                            <input
                                name="supportEmail"
                                type="email"
                                defaultValue={settings?.supportEmail || "support@shqipflix.vip"}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#0b0c15] border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 text-red-500">Danger Zone</h3>
                    <div className="flex items-center justify-between p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                        <div>
                            <h4 className="font-bold">Maintenance Mode</h4>
                            <p className="text-sm text-gray-400">Disable requests to the site temporarily</p>
                        </div>
                        <div className="relative inline-flex items-center">
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                defaultChecked={settings?.maintenanceMode || false}
                                className="w-5 h-5 accent-red-600"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

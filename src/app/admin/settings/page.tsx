
import { Settings, Save } from "lucide-react";
import { getSettings, updateSettings } from "./actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
    const settings = await getSettings();

    async function saveSettings(formData: FormData) {
        "use server";
        const siteName = formData.get("siteName") as string;
        const siteDescription = formData.get("siteDescription") as string;
        const keywords = formData.get("keywords") as string;
        const supportEmail = formData.get("supportEmail") as string;
        const logoUrl = formData.get("logoUrl") as string;
        const facebookUrl = formData.get("facebookUrl") as string;
        const instagramUrl = formData.get("instagramUrl") as string;
        const twitterUrl = formData.get("twitterUrl") as string;
        const analyticsId = formData.get("analyticsId") as string;
        const adFrequency = parseInt(formData.get("adFrequency") as string) || 30;
        const maintenanceMode = formData.get("maintenanceMode") === "on";

        await updateSettings({
            siteName,
            siteDescription,
            keywords,
            supportEmail,
            logoUrl,
            facebookUrl,
            instagramUrl,
            twitterUrl,
            analyticsId,
            adFrequency,
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
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">General Configuration</h3>
                        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-bold shadow-lg shadow-red-900/20">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                    <div className="grid gap-6 max-w-2xl">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Site Name</label>
                            <input
                                name="siteName"
                                type="text"
                                defaultValue={settings?.siteName || "ShqipFlix"}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Site Description</label>
                            <textarea
                                name="siteDescription"
                                rows={3}
                                defaultValue={settings?.siteDescription || ""}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-sm text-white"
                                placeholder="For SEO purposes..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">SEO Keywords (Comma separated)</label>
                            <input
                                name="keywords"
                                type="text"
                                defaultValue={settings?.keywords || ""}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-white"
                                placeholder="filma shqip, seriale..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Logo URL (Optional)</label>
                            <input
                                name="logoUrl"
                                type="text"
                                defaultValue={settings?.logoUrl || ""}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-white"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Support Email</label>
                            <input
                                name="supportEmail"
                                type="email"
                                defaultValue={settings?.supportEmail || "support@shqipflix.vip"}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-white"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Facebook URL</label>
                                <input
                                    name="facebookUrl"
                                    type="text"
                                    defaultValue={settings?.facebookUrl || ""}
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-white text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Instagram URL</label>
                                <input
                                    name="instagramUrl"
                                    type="text"
                                    defaultValue={settings?.instagramUrl || ""}
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-white text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Twitter/X URL</label>
                                <input
                                    name="twitterUrl"
                                    type="text"
                                    defaultValue={settings?.twitterUrl || ""}
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-white text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Google Analytics ID</label>
                                <input
                                    name="analyticsId"
                                    type="text"
                                    defaultValue={settings?.analyticsId || ""}
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-white text-sm"
                                    placeholder="G-XXXXXXX"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Ad Frequency (Minutes)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    name="adFrequency"
                                    type="number"
                                    min="0"
                                    defaultValue={settings?.adFrequency || 30}
                                    className="w-32 bg-[#050505] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors text-white"
                                />
                                <span className="text-xs text-gray-500">Wait time between bumper ads. Set to 0 to show on every play.</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="bg-[#0b0c15] border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 text-red-500">Danger Zone</h3>
                    <div className="flex items-center justify-between p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                        <div>
                            <h4 className="font-bold text-white">Maintenance Mode</h4>
                            <p className="text-sm text-gray-400">Disable requests to the site temporarily</p>
                        </div>
                        <div className="relative inline-flex items-center">
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                defaultChecked={settings?.maintenanceMode || false}
                                className="w-5 h-5 accent-red-600 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

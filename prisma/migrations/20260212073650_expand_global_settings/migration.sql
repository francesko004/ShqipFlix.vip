-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GlobalSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "siteName" TEXT NOT NULL DEFAULT 'ShqipFlix',
    "siteDescription" TEXT NOT NULL DEFAULT 'Platforma lider shqiptare për transmetimin e filmave, serialeve dhe kanaleve Live TV.',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@shqipflix.vip',
    "logoUrl" TEXT,
    "adFrequency" INTEGER NOT NULL DEFAULT 30,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GlobalSettings" ("id", "maintenanceMode", "siteName", "supportEmail", "updatedAt") SELECT "id", "maintenanceMode", "siteName", "supportEmail", "updatedAt" FROM "GlobalSettings";
DROP TABLE "GlobalSettings";
ALTER TABLE "new_GlobalSettings" RENAME TO "GlobalSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

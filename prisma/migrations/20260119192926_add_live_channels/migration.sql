-- CreateTable
CREATE TABLE "LiveChannel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "streamUrl" TEXT NOT NULL,
    "isIframe" BOOLEAN NOT NULL DEFAULT true,
    "logo" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "LiveChannel_category_idx" ON "LiveChannel"("category");

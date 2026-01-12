-- CreateTable
CREATE TABLE "MediaContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "posterPath" TEXT,
    "backdropPath" TEXT,
    "mediaType" TEXT NOT NULL,
    "releaseDate" TEXT,
    "voteAverage" REAL,
    "popularity" REAL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "MediaContent_mediaType_idx" ON "MediaContent"("mediaType");

-- CreateIndex
CREATE INDEX "MediaContent_popularity_idx" ON "MediaContent"("popularity");

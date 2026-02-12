-- CreateTable
CREATE TABLE "EpisodeHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tvId" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "episode" INTEGER NOT NULL,
    "watchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EpisodeHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MovieRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MovieRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BumperAd" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "advertiser" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "clickUrl" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 5,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "EpisodeHistory_userId_tvId_idx" ON "EpisodeHistory"("userId", "tvId");

-- CreateIndex
CREATE UNIQUE INDEX "EpisodeHistory_userId_tvId_season_episode_key" ON "EpisodeHistory"("userId", "tvId", "season", "episode");

-- CreateIndex
CREATE INDEX "Review_tmdbId_mediaType_idx" ON "Review"("tmdbId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_tmdbId_mediaType_key" ON "Review"("userId", "tmdbId", "mediaType");

-- CreateIndex
CREATE INDEX "MovieRequest_status_idx" ON "MovieRequest"("status");

-- CreateIndex
CREATE INDEX "MovieRequest_createdAt_idx" ON "MovieRequest"("createdAt");

-- CreateIndex
CREATE INDEX "BumperAd_isActive_idx" ON "BumperAd"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex
CREATE INDEX "Genre_slug_idx" ON "Genre"("slug");

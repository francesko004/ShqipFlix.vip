-- CreateTable
CREATE TABLE "UserGenreInterest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserGenreInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserGenreInterest_userId_idx" ON "UserGenreInterest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGenreInterest_userId_genreId_key" ON "UserGenreInterest"("userId", "genreId");

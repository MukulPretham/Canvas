-- CreateTable
CREATE TABLE "User" (
    "Sno" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Sno")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

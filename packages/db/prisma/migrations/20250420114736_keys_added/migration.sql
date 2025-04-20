/*
  Warnings:

  - A unique constraint covering the columns `[room,member]` on the table `JoinLogs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JoinLogs_room_member_key" ON "JoinLogs"("room", "member");

/*
  Warnings:

  - You are about to drop the column `role` on the `Membership` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."WhatsappPermissionTarget" AS ENUM ('MEMBERSHIP', 'DEPARTMENT');

-- AlterTable
ALTER TABLE "public"."Membership" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "public"."WhatsappInstancePermission" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "instanceName" TEXT,
    "targetType" "public"."WhatsappPermissionTarget" NOT NULL,
    "membershipId" TEXT,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WhatsappInstancePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WhatsappInstancePermission_instanceId_companyId_idx" ON "public"."WhatsappInstancePermission"("instanceId", "companyId");

-- AddForeignKey
ALTER TABLE "public"."WhatsappInstancePermission" ADD CONSTRAINT "WhatsappInstancePermission_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappInstancePermission" ADD CONSTRAINT "WhatsappInstancePermission_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "public"."Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappInstancePermission" ADD CONSTRAINT "WhatsappInstancePermission_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

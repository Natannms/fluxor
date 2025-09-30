-- CreateEnum
CREATE TYPE "public"."ProjectStage" AS ENUM ('OPORTUNIDADE', 'LEAD', 'BRIEFING1', 'BRIEFING2', 'DISCOVERY', 'PROPOSTA', 'CONTRATO', 'EXECUCAO', 'ENCERRADO');

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "clientPhone" TEXT,
    "stage" "public"."ProjectStage" NOT NULL DEFAULT 'OPORTUNIDADE',
    "probability" INTEGER,
    "budgetEstimate" DOUBLE PRECISION,
    "timelineEstimate" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "meetings" TEXT[],
    "artifacts" TEXT[],
    "approvals" TEXT[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

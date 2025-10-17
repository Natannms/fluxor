-- CreateTable
CREATE TABLE "public"."TaskStep" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT,

    CONSTRAINT "TaskStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "stepId" TEXT,
    "taskStepId" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT,
    "description" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TaskStep" ADD CONSTRAINT "TaskStep_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "public"."ProcessStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "public"."ProcessStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_taskStepId_fkey" FOREIGN KEY ("taskStepId") REFERENCES "public"."TaskStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

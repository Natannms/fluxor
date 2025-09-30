-- CreateTable
CREATE TABLE "public"."Invite" (
    "id" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "public"."Invite"("token");

-- AddForeignKey
ALTER TABLE "public"."Invite" ADD CONSTRAINT "Invite_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invite" ADD CONSTRAINT "Invite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

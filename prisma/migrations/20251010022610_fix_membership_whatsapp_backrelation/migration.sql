-- AlterTable
ALTER TABLE "public"."Membership" ADD COLUMN     "role" "public"."CompanyRole" NOT NULL DEFAULT 'COLABORADOR';

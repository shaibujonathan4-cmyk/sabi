-- AlterTable
ALTER TABLE "business_users" ADD COLUMN     "inviteEmail" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

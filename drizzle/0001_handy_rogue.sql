ALTER TABLE "contests" ALTER COLUMN "payPerView" SET DATA TYPE numeric(12, 0);--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "maxPayout" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "currentPayout" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "currentPayout" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "amount" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "platformFee" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "platformFee" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "netAmount" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "calculatedAmount" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "calculatedAmount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "paidAmount" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "paidAmount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "transactionContests" ALTER COLUMN "grossAmount" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "transactionContests" ALTER COLUMN "netAmount" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "transactionContests" ALTER COLUMN "platformFee" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "transactionContests" ALTER COLUMN "platformFee" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "totalSpent" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "totalSpent" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "totalEarnings" SET DATA TYPE numeric(15, 0);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "totalEarnings" SET DEFAULT '0';
CREATE TYPE "public"."contest_status" AS ENUM('draft', 'active', 'paused', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."contest_type" AS ENUM('clip', 'ugc', 'softSelling');--> statement-breakpoint
CREATE TYPE "public"."post_claim_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('submitted', 'reviewing', 'approved', 'rejected', 'published', 'claimed');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp with time zone,
	"refreshTokenExpiresAt" timestamp with time zone,
	"scope" text,
	"password" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contestReviews" (
	"id" text PRIMARY KEY NOT NULL,
	"contestId" text NOT NULL,
	"userId" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"isPublic" boolean DEFAULT true,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contests" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "contest_type" NOT NULL,
	"status" "contest_status" DEFAULT 'draft',
	"link" text NOT NULL,
	"thumbnailUrl" text,
	"payPerView" numeric(6, 4) NOT NULL,
	"maxPayout" numeric(10, 2) NOT NULL,
	"currentPayout" numeric(10, 2) DEFAULT '0',
	"minViews" integer DEFAULT 100,
	"submissionDeadline" timestamp with time zone,
	"requirements" text,
	"targetPlatforms" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text,
	"relatedEntityType" text,
	"relatedEntityId" text,
	"isRead" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pageViews" (
	"id" text PRIMARY KEY NOT NULL,
	"pageId" text NOT NULL,
	"visitorId" text,
	"referrer" text,
	"viewedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"alias" text NOT NULL,
	"slug" text NOT NULL,
	"displayName" text,
	"bio" text,
	"coverImageUrl" text,
	"websiteUrl" text,
	"socialLinks" text,
	"totalViews" integer DEFAULT 0,
	"averageRating" numeric(3, 2),
	"isPublic" boolean DEFAULT true,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pages_alias_unique" UNIQUE("alias"),
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"postId" text,
	"paymentMethodId" text,
	"amount" numeric(10, 2) NOT NULL,
	"platformFee" numeric(10, 2) DEFAULT '0',
	"netAmount" numeric(10, 2) NOT NULL,
	"status" text NOT NULL,
	"midtransTransactionId" text,
	"midtransOrderId" text,
	"midtransStatus" text,
	"midtransPaymentType" text,
	"midtransResponseJson" text,
	"failureReason" text,
	"requestedAt" timestamp with time zone DEFAULT now(),
	"processedAt" timestamp with time zone,
	"completedAt" timestamp with time zone,
	CONSTRAINT "payouts_midtransOrderId_unique" UNIQUE("midtransOrderId")
);
--> statement-breakpoint
CREATE TABLE "postViewHistory" (
	"id" text PRIMARY KEY NOT NULL,
	"postId" text NOT NULL,
	"views" integer NOT NULL,
	"viewsChange" integer DEFAULT 0,
	"checkedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"contestId" text NOT NULL,
	"userId" text NOT NULL,
	"accountId" text,
	"url" text NOT NULL,
	"status" "post_status" DEFAULT 'submitted',
	"claimStatus" "post_claim_status" DEFAULT 'pending',
	"views" integer DEFAULT 0,
	"lastViewCheck" timestamp with time zone,
	"calculatedAmount" numeric(10, 2) DEFAULT '0',
	"paidAmount" numeric(10, 2) DEFAULT '0',
	"submittedAt" timestamp with time zone DEFAULT now(),
	"approvedAt" timestamp with time zone,
	"publishedAt" timestamp with time zone,
	"claimedAt" timestamp with time zone,
	"rejectionReason" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "posts_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "transactionContests" (
	"id" text PRIMARY KEY NOT NULL,
	"contestId" text NOT NULL,
	"userId" text NOT NULL,
	"grossAmount" numeric(10, 2) NOT NULL,
	"netAmount" numeric(10, 2) NOT NULL,
	"platformFee" numeric(10, 2) DEFAULT '0',
	"paymentMethod" text,
	"status" text NOT NULL,
	"midtransSnapToken" text,
	"midtransTransactionId" text,
	"midtransOrderId" text,
	"midtransPaymentType" text,
	"midtransResponseJson" text,
	"transactionRef" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "transactionContests_midtransOrderId_unique" UNIQUE("midtransOrderId")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"username" text,
	"displayUsername" text,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"totalSpent" numeric(10, 2) DEFAULT '0',
	"totalContestsCreated" integer DEFAULT 0,
	"totalPosts" integer DEFAULT 0,
	"totalEarnings" numeric(10, 2) DEFAULT '0',
	"clipperExp" integer DEFAULT 0,
	"clipperLevel" integer DEFAULT 1,
	"clipperBio" text,
	"avatarUrl" text,
	"isActive" boolean DEFAULT true,
	"lastLoginAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "userPaymentMethods" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"bankName" text,
	"accountNumber" text,
	"accountHolderName" text,
	"walletProvider" text,
	"walletPhoneNumber" text,
	"cardToken" text,
	"cardMasked" text,
	"cardType" text,
	"isPrimary" boolean DEFAULT false,
	"isVerified" boolean DEFAULT false,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contestReviews" ADD CONSTRAINT "contestReviews_contestId_contests_id_fk" FOREIGN KEY ("contestId") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contestReviews" ADD CONSTRAINT "contestReviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contests" ADD CONSTRAINT "contests_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pageViews" ADD CONSTRAINT "pageViews_pageId_pages_id_fk" FOREIGN KEY ("pageId") REFERENCES "public"."pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_paymentMethodId_userPaymentMethods_id_fk" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."userPaymentMethods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "postViewHistory" ADD CONSTRAINT "postViewHistory_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_contestId_contests_id_fk" FOREIGN KEY ("contestId") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactionContests" ADD CONSTRAINT "transactionContests_contestId_contests_id_fk" FOREIGN KEY ("contestId") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactionContests" ADD CONSTRAINT "transactionContests_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userPaymentMethods" ADD CONSTRAINT "userPaymentMethods_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
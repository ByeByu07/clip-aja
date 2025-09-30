import { pgTable, text, boolean, timestamp, integer, decimal, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const contestTypeEnum = pgEnum('contest_type', ['clip', 'ugc', 'softSelling']);
export const contestStatusEnum = pgEnum('contest_status', ['draft', 'active', 'paused', 'completed', 'cancelled']);
export const postStatusEnum = pgEnum('post_status', ['submitted', 'reviewing', 'approved', 'rejected', 'published', 'claimed']);
export const postClaimStatusEnum = pgEnum('post_claim_status', ['pending', 'approved', 'rejected']);

// User table - merged with contest platform schema
export const user = pgTable("user", {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    
    // Auth fields
    name: text('name'),
    displayUsername: text('displayUsername'),
    username: text('username'),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').default(false).notNull(),
    image: text('image'),
    
    // Password for local auth (optional if using OAuth)
    passwordHash: text('passwordHash'),
    
    // Owner-specific fields
    totalSpent: decimal('totalSpent', { precision: 10, scale: 2 }).default('0'),
    totalContestsCreated: integer('totalContestsCreated').default(0),
    
    // Clipper-specific fields
    totalPosts: integer('totalPosts').default(0),
    totalEarnings: decimal('totalEarnings', { precision: 10, scale: 2 }).default('0'),
    clipperExp: integer('clipperExp').default(0),
    clipperLevel: integer('clipperLevel').default(1),
    clipperBio: text('clipperBio'),
    
    // Common fields
    avatarUrl: text('avatarUrl'),
    isActive: boolean('isActive').default(true),
    lastLoginAt: timestamp('lastLoginAt', { withTimezone: true }),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull()
});

export const session = pgTable("session", {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { withTimezone: true }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull()
});

export const verification = pgTable("verification", {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
});

// Profile pages for contest owners
export const pages = pgTable("pages", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('userId').notNull().references(() => user.id),
    alias: text('alias').notNull().unique(),
    slug: text('slug').notNull().unique(),
    displayName: text('displayName'),
    bio: text('bio'),
    coverImageUrl: text('coverImageUrl'),
    websiteUrl: text('websiteUrl'),
    socialLinks: text('socialLinks'),
    totalViews: integer('totalViews').default(0),
    averageRating: decimal('averageRating', { precision: 3, scale: 2 }),
    isPublic: boolean('isPublic').default(true),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
});

// Contests
export const contests = pgTable("contests", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('userId').notNull().references(() => user.id),
    title: text('title').notNull(),
    description: text('description'),
    type: contestTypeEnum('type').notNull(),
    status: contestStatusEnum('status').default('draft'),
    link: text('link').notNull(),
    thumbnailUrl: text('thumbnailUrl'),
    payPerView: decimal('payPerView', { precision: 6, scale: 4 }).notNull(),
    maxPayout: decimal('maxPayout', { precision: 10, scale: 2 }).notNull(),
    currentPayout: decimal('currentPayout', { precision: 10, scale: 2 }).default('0'),
    minViews: integer('minViews').default(100),
    submissionDeadline: timestamp('submissionDeadline', { withTimezone: true }),
    requirements: text('requirements'),
    targetPlatforms: text('targetPlatforms'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
});

// Transaction for contest funding
export const transactionContests = pgTable("transactionContests", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    contestId: integer('contestId').notNull().references(() => contests.id),
    userId: text('userId').notNull().references(() => user.id),
    grossAmount: decimal('grossAmount', { precision: 10, scale: 2 }).notNull(),
    netAmount: decimal('netAmount', { precision: 10, scale: 2 }).notNull(),
    platformFee: decimal('platformFee', { precision: 10, scale: 2 }).default('0'),
    paymentMethod: text('paymentMethod'),
    status: text('status').notNull(),
    midtransSnapToken: text('midtransSnapToken'),
    midtransTransactionId: text('midtransTransactionId'),
    midtransOrderId: text('midtransOrderId').unique(),
    midtransPaymentType: text('midtransPaymentType'),
    midtransResponseJson: text('midtransResponseJson'),
    transactionRef: text('transactionRef'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
});

// Posts submitted by clippers
export const posts = pgTable("posts", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    contestId: integer('contestId').notNull().references(() => contests.id),
    userId: text('userId').notNull().references(() => user.id),
    socialAccountId: integer('socialAccountId').references(() => account.id),
    url: text('url').notNull().unique(),
    status: postStatusEnum('status').default('submitted'),
    claimStatus: postClaimStatusEnum('claimStatus').default('pending'),
    views: integer('views').default(0),
    lastViewCheck: timestamp('lastViewCheck', { withTimezone: true }),
    calculatedAmount: decimal('calculatedAmount', { precision: 10, scale: 2 }).default('0'),
    paidAmount: decimal('paidAmount', { precision: 10, scale: 2 }).default('0'),
    submittedAt: timestamp('submittedAt', { withTimezone: true }).defaultNow(),
    approvedAt: timestamp('approvedAt', { withTimezone: true }),
    publishedAt: timestamp('publishedAt', { withTimezone: true }),
    claimedAt: timestamp('claimedAt', { withTimezone: true }),
    rejectionReason: text('rejectionReason'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
});

// Post view history
export const postViewHistory = pgTable("postViewHistory", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    postId: integer('postId').notNull().references(() => posts.id),
    views: integer('views').notNull(),
    viewsChange: integer('viewsChange').default(0),
    checkedAt: timestamp('checkedAt', { withTimezone: true }).defaultNow()
});

// User payment methods
export const userPaymentMethods = pgTable("userPaymentMethods", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('userId').notNull().references(() => user.id),
    type: text('type').notNull(),
    bankName: text('bankName'),
    accountNumber: text('accountNumber'),
    accountHolderName: text('accountHolderName'),
    walletProvider: text('walletProvider'),
    walletPhoneNumber: text('walletPhoneNumber'),
    cardToken: text('cardToken'),
    cardMasked: text('cardMasked'),
    cardType: text('cardType'),
    isPrimary: boolean('isPrimary').default(false),
    isVerified: boolean('isVerified').default(false),
    isActive: boolean('isActive').default(true),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
});

// Payouts to clippers
export const payouts = pgTable("payouts", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('userId').notNull().references(() => user.id),
    postId: integer('postId').references(() => posts.id),
    paymentMethodId: integer('paymentMethodId').references(() => userPaymentMethods.id),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    platformFee: decimal('platformFee', { precision: 10, scale: 2 }).default('0'),
    netAmount: decimal('netAmount', { precision: 10, scale: 2 }).notNull(),
    status: text('status').notNull(),
    midtransTransactionId: text('midtransTransactionId'),
    midtransOrderId: text('midtransOrderId').unique(),
    midtransStatus: text('midtransStatus'),
    midtransPaymentType: text('midtransPaymentType'),
    midtransResponseJson: text('midtransResponseJson'),
    failureReason: text('failureReason'),
    requestedAt: timestamp('requestedAt', { withTimezone: true }).defaultNow(),
    processedAt: timestamp('processedAt', { withTimezone: true }),
    completedAt: timestamp('completedAt', { withTimezone: true })
});

// Contest reviews
export const contestReviews = pgTable("contestReviews", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    contestId: integer('contestId').notNull().references(() => contests.id),
    userId: text('userId').notNull().references(() => user.id),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    isPublic: boolean('isPublic').default(true),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow()
});

// Page views analytics
export const pageViews = pgTable("pageViews", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    pageId: integer('pageId').notNull().references(() => pages.id),
    visitorId: text('visitorId'),
    referrer: text('referrer'),
    viewedAt: timestamp('viewedAt', { withTimezone: true }).defaultNow()
});

// Notifications
export const notifications = pgTable("notifications", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('userId').notNull().references(() => user.id),
    type: text('type').notNull(),
    title: text('title').notNull(),
    message: text('message'),
    relatedEntityType: text('relatedEntityType'),
    relatedEntityId: integer('relatedEntityId'),
    isRead: boolean('isRead').default(false),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow()
});
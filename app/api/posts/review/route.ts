import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, contests, user } from '@/drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET - Fetch published posts for owner to review
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session?.user.id) {
            return NextResponse.json({
                status: "error",
                code: 401,
                message: "Unauthorized",
                data: null,
                errors: ["User not authenticated"]
            }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const contestId = searchParams.get('contestId');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!contestId) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Missing contestId",
                data: null,
                errors: ["contestId is required"]
            }, { status: 400 });
        }

        // Verify the contest belongs to the user
        const [contest] = await db
            .select()
            .from(contests)
            .where(and(
                eq(contests.id, contestId),
                eq(contests.userId, String(session.user.id))
            ))
            .limit(1);

        if (!contest) {
            return NextResponse.json({
                status: "error",
                code: 404,
                message: "Contest not found or unauthorized",
                data: null,
                errors: ["Contest not found or you don't have permission"]
            }, { status: 404 });
        }

        // Fetch published posts that need owner review
        const reviewPosts = await db
            .select({
                postId: posts.id,
                postUrl: posts.url,
                postStatus: posts.status,
                postViews: posts.views,
                postCalculatedAmount: posts.calculatedAmount,
                postSubmittedAt: posts.submittedAt,
                postPublishedAt: posts.publishedAt,
                postCreatedAt: posts.createdAt,
                clipperId: user.id,
                clipperName: user.name,
                clipperUsername: user.username,
                clipperImage: user.image,
                clipperLevel: user.clipperLevel,
                contestId: contests.id,
                contestTitle: contests.title,
                contestPayPerView: contests.payPerView,
                contestMaxPayout: contests.maxPayout,
                contestCurrentPayout: contests.currentPayout,
                contestStatus: contests.status,
            })
            .from(posts)
            .innerJoin(contests, eq(posts.contestId, contests.id))
            .innerJoin(user, eq(posts.userId, user.id))
            .where(and(
                eq(posts.contestId, contestId),
                eq(posts.status, 'published')
            ))
            .orderBy(desc(posts.publishedAt))
            .limit(limit);

        // Calculate remaining payout
        const remainingPayout = parseFloat(contest.maxPayout) - parseFloat(contest.currentPayout);

        return NextResponse.json({
            status: "success",
            code: 200,
            message: "Review posts retrieved successfully",
            data: {
                posts: reviewPosts,
                contest: {
                    id: contest.id,
                    title: contest.title,
                    status: contest.status,
                    payPerView: contest.payPerView,
                    maxPayout: contest.maxPayout,
                    currentPayout: contest.currentPayout,
                    remainingPayout: remainingPayout.toString(),
                },
                totalPendingReview: reviewPosts.length
            },
            errors: null
        });

    } catch (error) {
        console.error('Fetch review posts error:', error);
        return NextResponse.json({
            status: "error",
            code: 500,
            message: "Internal server error",
            data: null,
            errors: ["Failed to fetch review posts"]
        }, { status: 500 });
    }
}

// PATCH - Approve or reject a published post
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session?.user.id) {
            return NextResponse.json({
                status: "error",
                code: 401,
                message: "Unauthorized",
                data: null,
                errors: ["User not authenticated"]
            }, { status: 401 });
        }

        const body = await request.json();
        const { postId, action, rejectionReason } = body;

        // Validate required fields
        if (!postId || !action) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Missing required fields",
                data: null,
                errors: ["postId and action are required"]
            }, { status: 400 });
        }

        if (!['approve', 'reject'].includes(action)) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Invalid action",
                data: null,
                errors: ["action must be either 'approve' or 'reject'"]
            }, { status: 400 });
        }

        // Fetch the post with contest information
        const [postData] = await db
            .select({
                post: posts,
                contest: contests
            })
            .from(posts)
            .innerJoin(contests, eq(posts.contestId, contests.id))
            .where(eq(posts.id, postId))
            .limit(1);

        if (!postData) {
            return NextResponse.json({
                status: "error",
                code: 404,
                message: "Post not found",
                data: null,
                errors: ["Post not found"]
            }, { status: 404 });
        }

        // Verify the contest belongs to the user
        if (postData.contest.userId !== String(session.user.id)) {
            return NextResponse.json({
                status: "error",
                code: 403,
                message: "Unauthorized",
                data: null,
                errors: ["You don't have permission to review this post"]
            }, { status: 403 });
        }

        // Check if post is published (ready for owner review)
        if (postData.post.status !== 'published') {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Post cannot be reviewed",
                data: null,
                errors: ["Only published posts can be reviewed"]
            }, { status: 400 });
        }

        let updatedPost;

        if (action === 'approve') {
            // Approve the post - add payout to contest's current payout
            const calculatedAmount = parseFloat(postData.post.calculatedAmount);
            const newCurrentPayout = parseFloat(postData.contest.currentPayout) + calculatedAmount;

            updatedPost = await db
                .update(posts)
                .set({
                    status: 'approved',
                    approvedAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(posts.id, postId))
                .returning();

            // Update contest's current payout (add approved post amount)
            await db
                .update(contests)
                .set({
                    currentPayout: newCurrentPayout.toString(),
                    updatedAt: new Date()
                })
                .where(eq(contests.id, postData.contest.id));

        } else {
            // Reject the post - just change status, no payout change needed
            updatedPost = await db
                .update(posts)
                .set({
                    status: 'rejected',
                    rejectionReason: rejectionReason || 'No reason provided',
                    updatedAt: new Date()
                })
                .where(eq(posts.id, postId))
                .returning();
        }

        return NextResponse.json({
            status: "success",
            code: 200,
            message: `Post ${action}d successfully`,
            data: updatedPost[0],
            errors: null
        });

    } catch (error) {
        console.error('Review post error:', error);
        return NextResponse.json({
            status: "error",
            code: 500,
            message: "Internal server error",
            data: null,
            errors: ["Failed to review post"]
        }, { status: 500 });
    }
}

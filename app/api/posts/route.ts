import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, contests, account } from '@/drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Helper function to extract video ID from TikTok URL
function extractVideoId(url: string): string | null {
    try {
        // Match patterns like: /video/1234567890123456789
        const match = url.match(/\/video\/(\d+)/);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error extracting video ID:', error);
        return null;
    }
}

// Helper function to fetch video info from TikTok API
async function fetchTikTokVideoInfo(videoId: string, accessToken: string) {
    try {
        const response = await fetch(`https://open.tiktokapis.com/v2/video/query/?fields=id,view_count,create_time,share_url,video_description,duration,title`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filters: {
                    video_ids: [videoId]
                }
            })
        });

        if (!response.ok) {
            console.error('TikTok API error:', await response.text());
            return null;
        }

        const data = await response.json();

        if (data.data?.videos && data.data.videos.length > 0) {
            return data.data.videos[0];
        }

        return null;
    } catch (error) {
        console.error('Error fetching TikTok video info:', error);
        return null;
    }
}

export async function POST(request: NextRequest) {
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
        const { contestId, accountId, url } = body;

        // Validate required fields
        if (!contestId || !accountId || !url) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Missing required fields",
                data: null,
                errors: ["contestId, accountId, and url are required"]
            }, { status: 400 });
        }

        // Validate URL is TikTok
        if (!url.includes('tiktok.com')) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Invalid URL",
                data: null,
                errors: ["URL must be a TikTok video link"]
            }, { status: 400 });
        }

        // Check if contest exists and is active
        const [contest] = await db
            .select()
            .from(contests)
            .where(eq(contests.id, contestId))
            .limit(1);

        if (!contest) {
            return NextResponse.json({
                status: "error",
                code: 404,
                message: "Contest not found",
                data: null,
                errors: ["Contest not found"]
            }, { status: 404 });
        }

        if (contest.status !== 'active') {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Contest is not active",
                data: null,
                errors: ["Cannot submit to inactive contest"]
            }, { status: 400 });
        }

        // Verify the account belongs to the user
        const [userAccount] = await db
            .select()
            .from(account)
            .where(and(
                eq(account.accountId, accountId),
                eq(account.userId, String(session.user.id))
            ))
            .limit(1);

        if (!userAccount) {
            return NextResponse.json({
                status: "error",
                code: 403,
                message: "Account not found or unauthorized",
                data: null,
                errors: ["Account does not belong to user"]
            }, { status: 403 });
        }

        // Extract video ID from URL
        const videoId = extractVideoId(url);
        if (!videoId) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Invalid TikTok URL",
                data: null,
                errors: ["Could not extract video ID from URL"]
            }, { status: 400 });
        }

        // Get access token from the account
        const accessToken = userAccount.accessToken;
        if (!accessToken) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "No access token available",
                data: null,
                errors: ["TikTok account not properly linked"]
            }, { status: 400 });
        }

        // Fetch video info from TikTok API
        const videoInfo = await fetchTikTokVideoInfo(videoId, accessToken);
        if (!videoInfo) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Failed to fetch video information",
                data: null,
                errors: ["Could not retrieve video data from TikTok. Please ensure the video exists and is accessible."]
            }, { status: 400 });
        }

        // Get view count
        const views = videoInfo.view_count || 0;

        // Calculate payout amount
        // Formula: (views / 1000) * payPerView
        const payPerView = parseFloat(contest.payPerView);
        const calculatedAmount = Math.floor((views / 1000) * payPerView);

        console.log(`Video views: ${views}, Pay per 1000 views: ${payPerView}, Calculated amount: ${calculatedAmount}`);

        // Check if user already submitted this URL
        const [existingPost] = await db
            .select()
            .from(posts)
            .where(and(
                eq(posts.url, url),
                eq(posts.contestId, contestId)
            ))
            .limit(1);

        if (existingPost) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "URL already submitted",
                data: null,
                errors: ["This video has already been submitted to this contest"]
            }, { status: 400 });
        }

        // Create post with 'published' status (skip reviewing)
        const newPost = await db
            .insert(posts)
            .values({
                id: crypto.randomUUID(),
                contestId: contestId,
                userId: String(session.user.id),
                accountId: userAccount.id,
                url: url,
                status: 'published', // Skip reviewing, directly published
                claimStatus: 'pending',
                views: views,
                lastViewCheck: new Date(),
                calculatedAmount: calculatedAmount.toString(),
                paidAmount: '0',
                submittedAt: new Date(),
                publishedAt: new Date(), // Set published time immediately
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning();

        return NextResponse.json({
            status: "success",
            code: 201,
            message: "Post submitted and published successfully",
            data: newPost[0],
            errors: null
        }, { status: 201 });

    } catch (error) {
        console.error('Post submission error:', error);
        return NextResponse.json({
            status: "error",
            code: 500,
            message: "Internal server error",
            data: null,
            errors: ["Failed to submit post"]
        }, { status: 500 });
    }
}

// GET - Fetch user's posts
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

        // Fetch user's posts with contest information
        const userPosts = await db
            .select({
                id: posts.id,
                url: posts.url,
                status: posts.status,
                claimStatus: posts.claimStatus,
                views: posts.views,
                calculatedAmount: posts.calculatedAmount,
                paidAmount: posts.paidAmount,
                submittedAt: posts.submittedAt,
                publishedAt: posts.publishedAt,
                lastViewCheck: posts.lastViewCheck,
                createdAt: posts.createdAt,
                contestId: contests.id,
                contestTitle: contests.title,
                contestPayPerView: contests.payPerView,
                contestStatus: contests.status
            })
            .from(posts)
            .innerJoin(contests, eq(posts.contestId, contests.id))
            .where(eq(posts.userId, String(session.user.id)))
            .orderBy(desc(posts.createdAt));

        return NextResponse.json({
            status: "success",
            code: 200,
            message: "Posts retrieved successfully",
            data: userPosts,
            errors: null
        });

    } catch (error) {
        console.error('Fetch posts error:', error);
        return NextResponse.json({
            status: "error",
            code: 500,
            message: "Internal server error",
            data: null,
            errors: ["Failed to fetch posts"]
        }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { Response } from "@/interface/response";
import { contests } from "@/drizzle/schema"
import { eq, getTableColumns } from "drizzle-orm";
import { db } from "@/lib/db"
import { r2Service } from "@/lib/r2-service";
import { auth } from "@/lib/auth";

type Contest = typeof contests.$inferInsert;
type Session = typeof auth.$Infer.Session;

export const POST = async (req: Request): Promise<NextResponse<Response>> => {
    const session : Session = await auth.api.getSession({
        headers: req.headers
    })

    const { thumbnailUrl, submissionDeadline, createdAt, updatedAt, ...body }: any = await req.json();

    // Helper function to convert date strings to Date objects
    const parseDate = (date: string | Date | null | undefined): Date | null => {
        if (!date) return null;
        return date instanceof Date ? date : new Date(date);
    };

    let uploadedThumbnail = null;

    if (thumbnailUrl) {
        if (thumbnailUrl.startsWith('data:')) {
            const base64Data = thumbnailUrl.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            uploadedThumbnail = await r2Service.uploadFile("thumbnail.jpg", buffer);
        } else if (thumbnailUrl.startsWith('http')) {
            const response = await fetch(thumbnailUrl);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            uploadedThumbnail = await r2Service.uploadFile("thumbnail.jpg", buffer);
        } else {
            const buffer = Buffer.from(thumbnailUrl);
            uploadedThumbnail = await r2Service.uploadFile("thumbnail.jpg", buffer);
        }
    }

    const contestData = {
        ...body,
        userId: session?.user.id,
        thumbnailUrl: uploadedThumbnail,
        submissionDeadline: parseDate(submissionDeadline),
        type: "clip",
        createdAt: parseDate(createdAt),
        updatedAt: parseDate(updatedAt),
    };

    const result = await db.insert(contests).values(contestData).returning();
    
    return NextResponse.json({
        status: "success",
        code: 200,
        message: "Contest created successfully",
        data: result[0],
        errors: null
    });
}

export async function GET(req: Request): Promise<NextResponse<Response>> {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userIdParam = searchParams.get('userId');
    const offset = (page - 1) * limit;

    const { userId,...rest } = getTableColumns(contests);

    const allContests = await db
        .select(rest)
        .from(contests)
        .where(userIdParam ? eq(contests.userId, String(userIdParam)) : undefined)
        .limit(limit)
        .offset(offset);
    
    return NextResponse.json({
        status: "success",
        code: 200,
        message: "Contests fetched successfully",
        data: allContests,
        errors: null
    });
}
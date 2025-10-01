import { NextResponse } from "next/server";
import { Response } from "@/interface/response";
import { contests } from "@/drizzle/schema"
import { and, asc, desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/lib/db"
import { r2Service } from "@/lib/r2-service";
import { auth } from "@/lib/auth";

type Contest = typeof contests.$inferInsert;
type Session = typeof auth.$Infer.Session;

// Helper function to get file extension from MIME type or data URL
const getFileExtension = (input: string): string => {
    // If it's a data URL, extract MIME type
    if (input.startsWith('data:')) {
        const mimeType = input.split(';')[0].split(':')[1];
        return getExtensionFromMimeType(mimeType);
    }
    // If it's a URL, try to get extension from the URL
    if (input.startsWith('http')) {
        const urlPath = new URL(input).pathname;
        const ext = urlPath.split('.').pop();
        if (ext && ext.length <= 5) return ext;
    }
    // Default fallback
    return 'bin';
};

// Map common MIME types to extensions
const getExtensionFromMimeType = (mimeType: string): string => {
    const mimeMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'image/bmp': 'bmp',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/quicktime': 'mov',
        'application/pdf': 'pdf',
        'application/json': 'json',
        'text/plain': 'txt',
    };
    return mimeMap[mimeType.toLowerCase()] || 'bin';
};

export async function POST(req: Request): Promise<NextResponse<Response>> {
    const session: Session = await auth.api.getSession({
        headers: req.headers
    })

    const { thumbnailUrl, submissionDeadline, ...body }: any = await req.json();

    // Helper function to convert date strings to Date objects
    const parseDate = (date: string | Date | null | undefined): Date | null => {
        if (!date) return null;
        return date instanceof Date ? date : new Date(date);
    };

    let uploadedThumbnail = null;
    let randomUUID = crypto.randomUUID();

    if (thumbnailUrl) {
        let buffer: Buffer;
        let fileExtension: string;

        if (thumbnailUrl.startsWith('data:')) {
            // Handle base64 data URL
            const base64Data = thumbnailUrl.split(',')[1];
            const contentType = thumbnailUrl.split(';')[0].split(':')[1];
            buffer = Buffer.from(base64Data, 'base64');
            fileExtension = getExtensionFromMimeType(contentType);
        } else if (thumbnailUrl.startsWith('http')) {
            // Handle external URL
            const response = await fetch(thumbnailUrl);
            const arrayBuffer = await response.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
            
            // Try to get extension from Content-Type header first
            const contentType = response.headers.get('content-type');
            if (contentType) {
                fileExtension = getExtensionFromMimeType(contentType);
            } else {
                // Fallback to URL-based detection
                fileExtension = getFileExtension(thumbnailUrl);
            }
        } else {
            // Handle direct buffer/string data
            buffer = Buffer.from(thumbnailUrl);
            fileExtension = 'bin'; // Default for unknown types
        }

        uploadedThumbnail = await r2Service.uploadFile(`${randomUUID}.${fileExtension}`, buffer);
    }

    const contestData = {
        ...body,
        userId: session?.user.id,
        thumbnailUrl: uploadedThumbnail,
        submissionDeadline: parseDate(submissionDeadline),
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
    
    // Parse query parameters with consistent naming
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Exclude userId from selected columns
    const { userId: excludedUserId, ...selectedColumns } = getTableColumns(contests);

    // Build where conditions dynamically
    const whereConditions = [];
    if (userId) {
        whereConditions.push(eq(contests.userId, userId));
    }
    if (status) {
        whereConditions.push(eq(contests.status, status));
    }

    // Fetch contests with filters, ordered by newest first
    const allContests = await db
        .select(selectedColumns)
        .from(contests)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(desc(contests.createdAt)) // Changed to desc for newest first
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
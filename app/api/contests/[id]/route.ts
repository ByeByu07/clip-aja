import { NextResponse } from "next/server";
import { Response } from "@/interface/response";
import { contests } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }): Promise<NextResponse<Response>> {

    const _params = await params;
    const id = _params.id;
    
    const result = await db.select().from(contests).where(eq(contests.id, id));

    return NextResponse.json({
        status: "success",
        code: 200,
        message: "Contest fetched successfully",
        data: result,
        errors: null
    });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }): Promise<NextResponse<Response>> {
    const { id } = await params;
    
    const session = await auth.api.getSession({
        headers: req.headers
    })
    
    const result = await db.update(contests).set({
        
    }).where(and(eq(contests.id, id), eq(contests.userId, String(session?.user.id))));
    
    return NextResponse.json({
        status: "success",
        code: 200,
        message: "Contest updated successfully",
        data: result,
        errors: null
    });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }): Promise<NextResponse<Response>> {
    const { id } = await params;
    
    const session = await auth.api.getSession({
        headers: req.headers
    })
    
    const result = await db.delete(contests).where(and(eq(contests.id, id), eq(contests.userId, String(session?.user.id))));
    
    return NextResponse.json({
        status: "success",
        code: 200,
        message: "Contest deleted successfully",
        data: result,
        errors: null
    });
}

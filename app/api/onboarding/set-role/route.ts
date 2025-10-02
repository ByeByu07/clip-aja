import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the session from the request
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, referralSource } = await request.json();

    // Validate role
    if (!role || (role !== "advertiser" && role !== "clipper")) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'advertiser' or 'clipper'" },
        { status: 400 }
      );
    }

    // Validate referral source
    if (!referralSource || typeof referralSource !== "string") {
      return NextResponse.json(
        { error: "Referral source is required" },
        { status: 400 }
      );
    }

    // Set the user role using the admin API
    // await auth.api.setRole({
    //   body: {
    //     userId: session.user.id,
    //     role: role,
    //   },
    //   headers: request.headers,
    // });

    // Update referral source in database
    await db
      .update(user)
      .set({
        role: role,
        referralSource: referralSource,
        updatedAt: new Date()
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true, role, referralSource });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

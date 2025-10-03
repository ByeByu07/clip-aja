import { NextResponse } from "next/server";
import { Response } from "@/interface/response";
import { contests, transactionContests } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import * as MidtransClient from "midtrans-client";

type ContestAction = 'activate' | 'complete' | 'duplicate' | 'delete';

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
): Promise<NextResponse<Response>> {
    const { id } = await params;
    const { action }: { action: ContestAction } = await req.json();

    const session = await auth.api.getSession({
        headers: req.headers
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

    try {
        const contest = await db.select().from(contests)
            .where(and(eq(contests.id, id), eq(contests.userId, String(session.user.id))))
            .limit(1);

        if (!contest.length) {
            return NextResponse.json({
                status: "error",
                code: 404,
                message: "Contest not found",
                data: null,
                errors: ["Contest not found or access denied"]
            }, { status: 404 });
        }

        let result;
        let message = "";

        switch (action) {
            case 'activate':
                if (contest[0].status !== 'draft') {
                    return NextResponse.json({
                        status: "error",
                        code: 400,
                        message: "Contest can only be activated from draft status",
                        data: null,
                        errors: ["Invalid status transition"]
                    }, { status: 400 });
                }

                // Check for existing pending payment
                const existingTransaction = await db.select()
                    .from(transactionContests)
                    .where(and(
                        eq(transactionContests.contestId, id),
                        eq(transactionContests.userId, String(session.user.id)),
                        eq(transactionContests.status, 'pending')
                    ))
                    .limit(1);

                // If there's an existing pending transaction, return it
                if (existingTransaction.length > 0) {
                    const transaction = existingTransaction[0];

                    // Check if the snap token is still valid (Midtrans tokens typically expire after 24 hours)
                    const transactionAge = Date.now() - new Date(transaction.createdAt!).getTime();
                    const twentyFourHours = 24 * 60 * 60 * 1000;

                    if (transactionAge < twentyFourHours && transaction.midtransSnapToken) {
                        // Return existing payment link
                        return NextResponse.json({
                            status: "success",
                            code: 200,
                            message: "Payment link already exists",
                            data: {
                                paymentUrl: `https://app.${process.env.NODE_ENV === 'production' ? '' : 'sandbox.'}midtrans.com/snap/v2/vtweb/${transaction.midtransSnapToken}`,
                                snapToken: transaction.midtransSnapToken,
                                orderId: transaction.midtransOrderId,
                                amount: transaction.grossAmount,
                                expiresIn: Math.floor((twentyFourHours - transactionAge) / 1000 / 60) // minutes remaining
                            },
                            errors: null
                        });
                    }
                }

                // Setup Midtrans client
                const isProduction = process.env.NODE_ENV === "production";
                const serverKey = isProduction
                    ? process.env.MIDTRANS_SERVER_KEY
                    : process.env.MIDTRANS_SANDBOX_SERVER_KEY;
                const clientKey = isProduction
                    ? process.env.MIDTRANS_CLIENT_KEY
                    : process.env.MIDTRANS_SANDBOX_CLIENT_KEY;

                if (!serverKey || !clientKey) {
                    return NextResponse.json({
                        status: "error",
                        code: 500,
                        message: "Payment service configuration error",
                        data: null,
                        errors: ["Midtrans credentials not configured"]
                    }, { status: 500 });
                }

                const midtransClient = new MidtransClient.Snap({
                    isProduction,
                    serverKey,
                    clientKey,
                });

                // Calculate platform fee (e.g., 5% of maxPayout)
                const maxPayout = parseFloat(contest[0].maxPayout);
                const platformFeePercentage = 0.05; // 5%
                const platformFee = Math.round(maxPayout * platformFeePercentage);
                const grossAmount = maxPayout + platformFee;

                // Generate unique order ID
                const timestampShort = Date.now().toString().slice(-8);
                const orderId = `CONTEST-${id.slice(0, 8)}-${timestampShort}`;

                // Create Midtrans transaction
                const midtransTransaction = await midtransClient.createTransaction({
                    transaction_details: {
                        order_id: orderId,
                        gross_amount: grossAmount
                    },
                    customer_details: {
                        first_name: session.user.name || 'User',
                        email: session.user.email,
                    },
                    item_details: [{
                        id: id,
                        price: grossAmount,
                        quantity: 1,
                        name: `Contest Activation: ${contest[0].title}`,
                        category: 'Contest'
                    }],
                    callbacks: {
                        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/contests/${id}`
                    }
                });

                // Save transaction to database
                result = await db.insert(transactionContests).values({
                    id: crypto.randomUUID(),
                    contestId: id,
                    userId: String(session.user.id),
                    grossAmount: grossAmount.toString(),
                    netAmount: maxPayout.toString(),
                    platformFee: platformFee.toString(),
                    status: 'pending',
                    midtransSnapToken: midtransTransaction.token,
                    midtransOrderId: orderId,
                    midtransResponseJson: JSON.stringify(midtransTransaction),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }).returning();

                return NextResponse.json({
                    status: "success",
                    code: 200,
                    message: "Payment link created successfully",
                    data: {
                        paymentUrl: midtransTransaction.redirect_url,
                        snapToken: midtransTransaction.token,
                        orderId: orderId,
                        amount: grossAmount,
                        platformFee: platformFee
                    },
                    errors: null
                });

            case 'complete':
                if (contest[0].status !== 'active') {
                    return NextResponse.json({
                        status: "error",
                        code: 400,
                        message: "Contest can only be completed from active status",
                        data: null,
                        errors: ["Invalid status transition"]
                    }, { status: 400 });
                }

                result = await db.update(contests)
                    .set({
                        status: 'completed',
                        updatedAt: new Date()
                    })
                    .where(and(eq(contests.id, id), eq(contests.userId, String(session.user.id))))
                    .returning();
                message = "Contest completed successfully";
                break;

            case 'duplicate':
                const { id: originalId, createdAt, updatedAt, ...contestData } = contest[0];

                result = await db.insert(contests)
                    .values({
                        ...contestData,
                        title: `${contestData.title} (Copy)`,
                        status: 'draft',
                        currentPayout: '0',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                    .returning();
                message = "Contest duplicated successfully";
                break;

            case 'delete':
                result = await db.delete(contests)
                    .where(and(eq(contests.id, id), eq(contests.userId, String(session.user.id))))
                    .returning();
                message = "Contest deleted successfully";
                break;

            default:
                return NextResponse.json({
                    status: "error",
                    code: 400,
                    message: "Invalid action",
                    data: null,
                    errors: ["Invalid action provided"]
                }, { status: 400 });
        }

        return NextResponse.json({
            status: "success",
            code: 200,
            message,
            data: result,
            errors: null
        });

    } catch (error) {
        console.error('Contest action error:', error);
        return NextResponse.json({
            status: "error",
            code: 500,
            message: "Internal server error",
            data: null,
            errors: ["Failed to perform contest action"]
        }, { status: 500 });
    }
}
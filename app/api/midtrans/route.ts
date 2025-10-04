import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { transactionContests, contests, user } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import * as MidtransClient from "midtrans-client";

type Session = typeof auth.$Infer.Session

export async function POST(request: NextRequest) {
  try {
    const session: Session | null = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
        data: null,
        errors: ['User not authenticated']
      }, { status: 401 });
    }

    const body = await request.json();
    const { contestId } = body;

    if (!contestId) {
      return NextResponse.json({
        status: 'error',
        code: 400,
        message: 'Missing contestId',
        data: null,
        errors: ['contestId is required']
      }, { status: 400 });
    }

    // Get contest details
    const [contest] = await db.select()
      .from(contests)
      .where(and(
        eq(contests.id, contestId),
        eq(contests.userId, String(session.user.id))
      ))
      .limit(1);

    if (!contest) {
      return NextResponse.json({
        status: 'error',
        code: 404,
        message: 'Contest not found',
        data: null,
        errors: ['Contest not found or access denied']
      }, { status: 404 });
    }

    if (contest.status !== 'draft') {
      return NextResponse.json({
        status: 'error',
        code: 400,
        message: 'Contest can only be activated from draft status',
        data: null,
        errors: ['Invalid status transition']
      }, { status: 400 });
    }

    // Check for existing pending payment
    const [existingTransaction] = await db.select()
      .from(transactionContests)
      .where(and(
        eq(transactionContests.contestId, contestId),
        eq(transactionContests.userId, String(session.user.id)),
        eq(transactionContests.status, 'pending')
      ))
      .limit(1);

    // If there's an existing pending transaction, return it
    if (existingTransaction) {
      const transactionAge = Date.now() - new Date(existingTransaction.createdAt!).getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (transactionAge < twentyFourHours && existingTransaction.midtransSnapToken) {
        return NextResponse.json({
          status: 'success',
          code: 200,
          message: 'Payment link already exists',
          data: {
            paymentUrl: `https://app.${process.env.NODE_ENV === 'production' ? '' : 'sandbox.'}midtrans.com/snap/v2/vtweb/${existingTransaction.midtransSnapToken}`,
            snapToken: existingTransaction.midtransSnapToken,
            orderId: existingTransaction.midtransOrderId,
            amount: existingTransaction.grossAmount,
            expiresIn: Math.floor((twentyFourHours - transactionAge) / 1000 / 60)
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
          status: 'error',
          code: 500,
          message: 'Payment service configuration error',
          data: null,
          errors: ['Midtrans credentials not configured']
        }, { status: 500 });
    }

    const midtransClient = new MidtransClient.Snap({
        isProduction,
        serverKey,
        clientKey,
    });

    // Calculate platform fee (5% of maxPayout)
    const maxPayout = parseFloat(contest.maxPayout);
    const platformFeePercentage = 0.05;
    const platformFee = Math.round(maxPayout * platformFeePercentage);
    const grossAmount = maxPayout + platformFee;

    // Generate unique order ID
    const timestampShort = Date.now().toString().slice(-8);
    const orderId = `CONTEST-${contestId.slice(0, 8)}-${timestampShort}`;

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
            id: contestId,
            price: grossAmount,
            quantity: 1,
            name: `Contest Activation: ${contest.title}`,
            category: 'Contest'
        }],
        callbacks: {
            finish: `${process.env.NEXT_PUBLIC_APP_URL}/contests/${contestId}`
        }
    });

    // Save transaction to database
    const newTransaction = await db.insert(transactionContests).values({
      id: crypto.randomUUID(),
      contestId: contestId,
      userId: String(session.user.id),
      grossAmount: grossAmount.toString(),
      netAmount: maxPayout.toString(),
      platformFee: platformFee.toString(),
      status: 'pending',
      midtransSnapToken: midtransTransaction.token,
      midtransTransactionId: midtransTransaction.transaction_id,
      midtransOrderId: orderId,
      midtransResponseJson: JSON.stringify(midtransTransaction),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return NextResponse.json({
      status: 'success',
      code: 200,
      message: 'Payment link created successfully',
      data: {
        paymentUrl: midtransTransaction.redirect_url,
        snapToken: midtransTransaction.token,
        orderId: orderId,
        amount: grossAmount,
        platformFee: platformFee,
        transaction: newTransaction[0]
      },
      errors: null
    });

  } catch (error) {
    console.error('Error creating Midtrans payment:', error);
    return NextResponse.json({
      status: 'error',
      code: 500,
      message: 'Internal server error',
      data: null,
      errors: [error instanceof Error ? error.message : 'Failed to create payment link']
    }, { status: 500 });
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    status: 'success',
    code: 200,
    message: 'Midtrans API endpoint is active',
    data: { timestamp: new Date().toISOString() },
    errors: null
  });
}
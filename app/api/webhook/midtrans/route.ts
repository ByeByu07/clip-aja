import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { transactionContests, contests } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Midtrans webhook notification interface
interface MidtransNotification {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  masked_card?: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;
  settlement_time?: string;
  custom_field1?: string;
  custom_field2?: string;
  custom_field3?: string;
}

// Helper function to verify signature
function verifySignature(notification: MidtransNotification): boolean {
  const isProduction = process.env.NODE_ENV === "production";
  const serverKey = isProduction
    ? process.env.MIDTRANS_SERVER_KEY
    : process.env.MIDTRANS_SANDBOX_SERVER_KEY;

  if (!serverKey) {
    console.error('MIDTRANS_SERVER_KEY not found in environment variables');
    return false;
  }

  const { order_id, status_code, gross_amount, signature_key } = notification;
  const signatureString = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const hash = crypto.createHash('sha512').update(signatureString).digest('hex');

  return hash === signature_key;
}

export async function POST(request: NextRequest) {
  try {
    const notification: MidtransNotification = await request.json();

    console.log('Received Midtrans notification:', notification);

    // Verify signature
    if (!verifySignature(notification)) {
      console.error('Invalid signature from Midtrans');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const {
      transaction_status,
      fraud_status,
      order_id,
      transaction_id,
      gross_amount,
      payment_type,
      settlement_time,
      custom_field1
    } = notification;

    // Find the transaction in our database
    const [existingTransaction] = await db
      .select()
      .from(transactionContests)
      .where(eq(transactionContests.midtransOrderId, order_id));

    if (!existingTransaction) {
      console.error(`Transaction not found: ${order_id}`);
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Update transaction status
    await db
      .update(transactionContests)
      .set({
        midtransTransactionId: transaction_id,
        status: transaction_status,
        midtransPaymentType: payment_type,
        midtransResponseJson: JSON.stringify(notification),
        updatedAt: new Date()
      })
      .where(eq(transactionContests.midtransOrderId, order_id));

    console.log(`Transaction ${order_id} updated with status: ${transaction_status}`);

    // If payment is successful (settlement or capture), activate the contest
    if ((transaction_status === 'settlement' || transaction_status === 'capture') && fraud_status === 'accept') {
      // Get contest details
      const [contest] = await db
        .select()
        .from(contests)
        .where(eq(contests.id, existingTransaction.contestId));

      if (contest) {
        // Activate the contest
        await db
          .update(contests)
          .set({
            status: 'active',
            updatedAt: new Date()
          })
          .where(eq(contests.id, existingTransaction.contestId));

        console.log(`Contest ${contest.title} (ID: ${contest.id}) activated successfully`);

        // Update transaction status to settlement/capture
        await db
          .update(transactionContests)
          .set({
            status: 'settlement',
            updatedAt: new Date()
          })
          .where(eq(transactionContests.midtransOrderId, order_id));

        console.log(`Transaction ${order_id} marked as settlement`);
      } else {
        console.error(`Contest not found for transaction ${order_id}`);
      }
    } else if (transaction_status === 'cancel' || transaction_status === 'expire' || transaction_status === 'failure') {
      // For cancelled/expired/failed payments, update transaction status
      await db
        .update(transactionContests)
        .set({
          status: transaction_status,
          updatedAt: new Date()
        })
        .where(eq(transactionContests.midtransOrderId, order_id));

      console.log(`Payment ${transaction_status} for order ${order_id} - contest not activated`);
    }

    return NextResponse.json({
      message: 'Webhook processed successfully',
      order_id,
      status: transaction_status
    });

  } catch (error) {
    console.error('Error processing Midtrans webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Midtrans webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
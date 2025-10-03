import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userPaymentMethods } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET - Fetch user's payment methods
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

        const paymentMethods = await db
            .select()
            .from(userPaymentMethods)
            .where(and(
                eq(userPaymentMethods.userId, String(session.user.id)),
                eq(userPaymentMethods.isActive, true)
            ));

        // Separate bank and e-wallet
        const bankTransfer = paymentMethods.find(pm => pm.type === 'bank_transfer');
        const ewallet = paymentMethods.find(pm => pm.type === 'ewallet');

        return NextResponse.json({
            status: "success",
            code: 200,
            message: "Payment methods retrieved successfully",
            data: {
                bankTransfer: bankTransfer || null,
                ewallet: ewallet || null
            },
            errors: null
        });

    } catch (error) {
        console.error('Get payment methods error:', error);
        return NextResponse.json({
            status: "error",
            code: 500,
            message: "Internal server error",
            data: null,
            errors: ["Failed to fetch payment methods"]
        }, { status: 500 });
    }
}

// POST - Create or update payment method
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
        const { type, name, account, bank, provider } = body;

        // Validate required fields
        if (!type || !name || !account) {
            return NextResponse.json({
                status: "error",
                code: 400,
                message: "Missing required fields",
                data: null,
                errors: ["type, name, and account are required"]
            }, { status: 400 });
        }

        // Check if payment method already exists for this type
        const existingMethod = await db
            .select()
            .from(userPaymentMethods)
            .where(and(
                eq(userPaymentMethods.userId, String(session.user.id)),
                eq(userPaymentMethods.type, type)
            ))
            .limit(1);

        let result;

        if (existingMethod.length > 0) {
            // Update existing payment method
            result = await db
                .update(userPaymentMethods)
                .set({
                    accountHolderName: name,
                    accountNumber: type === 'bank_transfer' ? account : undefined,
                    bankName: type === 'bank_transfer' ? (bank || provider) : undefined,
                    walletProvider: type === 'ewallet' ? (provider || bank) : undefined,
                    walletPhoneNumber: type === 'ewallet' ? account : undefined,
                    isActive: true,
                    updatedAt: new Date()
                })
                .where(and(
                    eq(userPaymentMethods.userId, String(session.user.id)),
                    eq(userPaymentMethods.type, type)
                ))
                .returning();
        } else {
            // Create new payment method
            result = await db
                .insert(userPaymentMethods)
                .values({
                    id: crypto.randomUUID(),
                    userId: String(session.user.id),
                    type: type,
                    accountHolderName: name,
                    accountNumber: type === 'bank_transfer' ? account : undefined,
                    bankName: type === 'bank_transfer' ? (bank || provider) : undefined,
                    walletProvider: type === 'ewallet' ? (provider || bank) : undefined,
                    walletPhoneNumber: type === 'ewallet' ? account : undefined,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                .returning();
        }

        return NextResponse.json({
            status: "success",
            code: 200,
            message: `Payment method ${existingMethod.length > 0 ? 'updated' : 'created'} successfully`,
            data: result[0],
            errors: null
        });

    } catch (error) {
        console.error('Save payment method error:', error);
        return NextResponse.json({
            status: "error",
            code: 500,
            message: "Internal server error",
            data: null,
            errors: ["Failed to save payment method"]
        }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, locale } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'invalid_email' },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existing = await adminDb
      .collection('subscribers')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ message: 'already_subscribed' });
    }

    // Add new subscriber
    await adminDb.collection('subscribers').add({
      email,
      locale: locale || 'ko',
      subscribedAt: new Date(),
      active: true,
    });

    return NextResponse.json({ message: 'success' });
  } catch (error: any) {
    console.error('[Subscribe API Error]:', error);
    return NextResponse.json(
      { error: 'internal_server_error', details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test semplice senza import di Stripe
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;

    return NextResponse.json({
      status: 'success',
      message: 'Test semplice completato',
      config: {
        hasSecretKey,
        hasPublishableKey,
        hasWebhookSecret,
        secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'Not set',
        publishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10) || 'Not set',
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL,
      }
    });

  } catch (error) {
    console.error('Stripe simple test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Errore nel test semplice',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

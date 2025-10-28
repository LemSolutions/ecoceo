import { NextRequest, NextResponse } from 'next/server';
import { getStripeInstance, validateStripeConfig, eurosToCents } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  // Validate Stripe configuration
  const configValidation = validateStripeConfig();
  if (!configValidation.isValid) {
    return NextResponse.json(
      { error: 'Stripe not configured', details: configValidation.errors },
      { status: 503 }
    );
  }

  const stripe = getStripeInstance();
  if (!stripe) {
    return NextResponse.json(
      { error: 'Failed to initialize Stripe' },
      { status: 500 }
    );
  }

  try {
    const { amount, currency = 'eur', metadata = {} } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: eurosToCents(amount), // Convert to cents using helper
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

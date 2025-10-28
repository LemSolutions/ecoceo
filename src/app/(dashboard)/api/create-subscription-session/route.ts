import { NextRequest, NextResponse } from 'next/server';
import { getStripeInstance, validateStripeConfig } from '@/lib/stripe';

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
    const { lookup_key, customerEmail, metadata = {} } = await request.json();

    if (!lookup_key) {
      return NextResponse.json(
        { error: 'Lookup key is required' },
        { status: 400 }
      );
    }

    // Get the price from Stripe using the lookup key
    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    });

    if (!prices.data.length) {
      return NextResponse.json(
        { error: 'Price not found' },
        { status: 404 }
      );
    }

    // Create Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      customer_email: customerEmail,
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/subscription/cancel`,
      metadata,
      subscription_data: {
        metadata,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating subscription session:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription session' },
      { status: 500 }
    );
  }
}

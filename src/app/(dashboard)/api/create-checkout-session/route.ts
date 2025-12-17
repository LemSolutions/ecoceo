import { NextRequest, NextResponse } from 'next/server';
import { getStripeInstance, createLineItemsWithPackaging, createShippingOptions, validateStripeConfig, calculatePackagingFee } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  // Validate Stripe configuration
  const configValidation = validateStripeConfig();
  if (!configValidation.isValid) {
    console.error('Stripe configuration errors:', configValidation.errors);
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

    const { items, customerEmail, orderNumber, country = 'IT', shippingAddress } = await request.json();
    console.log('Received checkout request:', { items: items?.length, customerEmail, orderNumber, shippingAddress });

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Calculate order total (before packaging fee)
    const orderTotal = items.reduce((total, item) => {
      return total + ((item.product.price.unit_amount / 100) * item.quantity);
    }, 0);

    // Create line items with packaging fees
    const lineItems = createLineItemsWithPackaging(items, orderTotal);

    // Use a simple, hardcoded URL for now to debug
    const baseUrl = 'http://localhost:3000';
    
    console.log('Creating checkout session with base URL:', baseUrl);
    console.log('Order number:', orderNumber);

    // Create or retrieve Stripe Customer with shipping address for prefilling
    let customerId: string | undefined;
    if (customerEmail && customerEmail.trim() && customerEmail.includes('@') && shippingAddress) {
      try {
        // Search for existing customer by email
        const existingCustomers = await stripe.customers.list({
          email: customerEmail.trim(),
          limit: 1,
        });

        if (existingCustomers.data.length > 0) {
          // Update existing customer with shipping address
          customerId = existingCustomers.data[0].id;
          await stripe.customers.update(customerId, {
            shipping: {
              address: {
                line1: shippingAddress.address || '',
                city: shippingAddress.city || '',
                postal_code: shippingAddress.postalCode || '',
                country: shippingAddress.country || country,
              },
              name: customerEmail.trim(), // Usa email come nome temporaneo
            },
          });
          console.log('Updated existing customer with shipping address:', customerId);
        } else {
          // Create new customer with email and shipping address
          const customer = await stripe.customers.create({
            email: customerEmail.trim(),
            shipping: {
              address: {
                line1: shippingAddress.address || '',
                city: shippingAddress.city || '',
                postal_code: shippingAddress.postalCode || '',
                country: shippingAddress.country || country,
              },
              name: customerEmail.trim(),
            },
          });
          customerId = customer.id;
          console.log('Created new customer with shipping address:', customerId);
        }
      } catch (customerError) {
        console.error('Error creating/updating customer:', customerError);
        // Continue without customer - email will still be prefilled
      }
    }

    // Prepare session data
    const sessionData: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${orderNumber}`,
      cancel_url: `${baseUrl}/shop/checkout`,
      metadata: {
        orderNumber,
        customerEmail: customerEmail || 'not_provided',
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
      },
      shipping_address_collection: {
        allowed_countries: ['IT', 'US', 'CA', 'GB', 'DE', 'FR', 'ES', 'AT', 'CH', 'BE', 'NL', 'LU', 'IE', 'AU', 'NZ', 'JP', 'KR', 'SG', 'HK', 'BR', 'AR', 'CL', 'MX'],
      },
      shipping_options: createShippingOptions(items, orderTotal, country),
    };

    // Add customer to session if available (this will prefill email and shipping address)
    if (customerId) {
      sessionData.customer = customerId;
    } else if (customerEmail && customerEmail.trim() && customerEmail.includes('@')) {
      // Fallback: just prefill email if customer creation failed
      sessionData.customer_email = customerEmail.trim();
    }

    console.log('Customer email validation:', { 
      original: customerEmail, 
      isValid: !!(customerEmail && customerEmail.trim() && customerEmail.includes('@')),
      willInclude: !!(customerEmail && customerEmail.trim() && customerEmail.includes('@'))
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create(sessionData);

    console.log('Checkout session created successfully:', session.id);
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url // Return the direct URL
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

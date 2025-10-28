import Stripe from 'stripe';
import { getImageUrl } from '@/sanity/lib/image';
import {
  getShippingPartners,
  createStripeShippingOptionsFromPartners,
  getBestShippingOption
} from './shippingPartners';
import {
  createDynamicShippingOptions,
  calculateOrderWeight,
  calculateDynamicShipping
} from './dynamicShipping';

// Stripe configuration
export const stripeConfig = {
  apiVersion: '2024-06-20' as const,
  currency: 'eur',
  allowedCountries: ['IT', 'US', 'CA', 'GB', 'DE', 'FR', 'ES'],
  freeShippingThreshold: 50, // €50 for free shipping
  shippingOptions: {
    standard: {
      amount: 499, // €4.99
      currency: 'eur',
      displayName: 'Spedizione Standard (2-5 giorni)',
      maxWeight: 2, // kg
      deliveryEstimate: {
        minimum: { unit: 'business_day' as const, value: 2 },
        maximum: { unit: 'business_day' as const, value: 5 }
      }
    },
    express: {
      amount: 999, // €9.99
      currency: 'eur',
      displayName: 'Spedizione Express (1-2 giorni)',
      maxWeight: 5, // kg
      deliveryEstimate: {
        minimum: { unit: 'business_day' as const, value: 1 },
        maximum: { unit: 'business_day' as const, value: 2 }
      }
    },
    heavy: {
      amount: 1999, // €19.99
      currency: 'eur',
      displayName: 'Spedizione Pesante (3-7 giorni)',
      maxWeight: 50, // kg
      deliveryEstimate: {
        minimum: { unit: 'business_day' as const, value: 3 },
        maximum: { unit: 'business_day' as const, value: 7 }
      }
    },
    free: {
      amount: 0, // Free
      currency: 'eur',
      displayName: 'Spedizione Gratuita (ordini sopra €50)',
      deliveryEstimate: {
        minimum: { unit: 'business_day' as const, value: 3 },
        maximum: { unit: 'business_day' as const, value: 7 }
      }
    }
  }
};

// Initialize Stripe instance
let stripeInstance: Stripe | null = null;

export const getStripeInstance = (): Stripe | null => {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY is not defined');
    return null;
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: stripeConfig.apiVersion,
    });
  }

  return stripeInstance;
};

// Helper function to convert euros to cents
export const eurosToCents = (euros: number): number => {
  return Math.round(euros * 100);
};

// Helper function to convert cents to euros
export const centsToEuros = (cents: number): number => {
  return cents / 100;
};

// Helper function to format price for display
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

// Helper function to create line items for checkout
export const createLineItems = (items: any[]) => {
  const lineItems = items.map((item: any) => ({
    price_data: {
      currency: stripeConfig.currency,
      product_data: {
        name: item.product.title,
        images: item.product.mainImage ? [getImageUrl(item.product.mainImage)] : [],
      },
      unit_amount: eurosToCents(item.product.price),
    },
    quantity: item.quantity,
  }));

  return lineItems;
};

// Helper function to create packaging fees (0.5% of order total, minimum €2)
export const calculatePackagingFee = (orderTotal: number): number => {
  const packagingPercentage = 0.005; // 0.5%
  const minimumFee = 2.00; // €2.00 minimum
  
  const calculatedFee = orderTotal * packagingPercentage;
  return Math.max(calculatedFee, minimumFee);
};

// Helper function to create line items with packaging fees
export const createLineItemsWithPackaging = (items: any[], orderTotal: number) => {
  const lineItems = items.map((item: any) => {
    // Safely get image URL - support both Sanity and Stripe products
    let imageUrl = '';
    try {
      if (item.product.mainImage) {
        // Sanity product
        imageUrl = getImageUrl(item.product.mainImage);
        // Validate that it's a proper URL
        if (!imageUrl.startsWith('http')) {
          imageUrl = '';
        }
      } else if (item.product.images && item.product.images.length > 0) {
        // Stripe product
        imageUrl = item.product.images[0];
        // Validate that it's a proper URL
        if (!imageUrl.startsWith('http')) {
          imageUrl = '';
        }
      }
    } catch (error) {
      console.error('Error processing image for product:', item.product.name || item.product.title, error);
      imageUrl = '';
    }

    // Support both Sanity and Stripe product formats
    const productName = item.product.name || item.product.title;
    const productPrice = item.product.price?.unit_amount || item.product.price;

    return {
      price_data: {
        currency: stripeConfig.currency,
        product_data: {
          name: productName,
          images: imageUrl ? [imageUrl] : [],
        },
        unit_amount: typeof productPrice === 'number' ? productPrice : eurosToCents(productPrice),
      },
      quantity: item.quantity,
    };
  });

  // Add packaging fee
  const packagingFee = calculatePackagingFee(orderTotal);
  lineItems.push({
    price_data: {
      currency: stripeConfig.currency,
      product_data: {
        name: 'Spese di Imballo',
        description: `0.5% del valore ordine (minimo €2.00)`,
      },
      unit_amount: eurosToCents(packagingFee),
    },
    quantity: 1,
  });

  return lineItems;
};

// Helper function to create shipping options with dynamic calculation
export const createShippingOptions = (items: any[] = [], orderTotal: number = 0, country: string = 'IT') => {
  // Use dynamic shipping calculation based on weight and country
  return createDynamicShippingOptions(items, country, orderTotal);
};

// Helper function to validate Stripe configuration
export const validateStripeConfig = () => {
  const errors: string[] = [];
  
  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push('STRIPE_SECRET_KEY is not defined');
  }
  
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    config: {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    }
  };
};

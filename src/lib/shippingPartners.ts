// Shipping Partners Configuration
export interface ShippingPartner {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  features: string[];
  pricing: {
    standard: number; // €
    express: number;  // €
    heavy: number;    // €
  };
  coverage: {
    countries: string[];
    maxWeight: number; // kg
    freeShippingThreshold: number; // €
  };
  tracking: {
    enabled: boolean;
    url: string;
  };
  affiliate: {
    enabled: boolean;
    commission: number; // percentage
    trackingId: string;
  };
}

// Configured Shipping Partners
export const shippingPartners: ShippingPartner[] = [
  {
    id: 'dhl',
    name: 'DHL Express',
    logo: '/images/shipping/dhl-logo.png',
    website: 'https://www.dhl.com',
    description: 'Spedizioni internazionali veloci e affidabili',
    features: [
      'Consegna in 1-3 giorni lavorativi',
      'Tracciamento in tempo reale',
      'Copertura mondiale',
      'Assicurazione inclusa'
    ],
    pricing: {
      standard: 8.99,
      express: 15.99,
      heavy: 25.99
    },
    coverage: {
      countries: ['IT', 'US', 'CA', 'GB', 'DE', 'FR', 'ES', 'NL', 'BE', 'AT', 'CH'],
      maxWeight: 30,
      freeShippingThreshold: 75
    },
    tracking: {
      enabled: true,
      url: 'https://www.dhl.com/tracking'
    },
    affiliate: {
      enabled: true,
      commission: 3.5, // 3.5% commission
      trackingId: 'DHL_AFFILIATE_001'
    }
  },
  {
    id: 'ups',
    name: 'UPS',
    logo: '/images/shipping/ups-logo.png',
    website: 'https://www.ups.com',
    description: 'Soluzioni logistiche complete per e-commerce',
    features: [
      'Consegna in 2-5 giorni lavorativi',
      'Gestione resi semplificata',
      'Integrazione API avanzata',
      'Supporto 24/7'
    ],
    pricing: {
      standard: 7.99,
      express: 12.99,
      heavy: 22.99
    },
    coverage: {
      countries: ['IT', 'US', 'CA', 'GB', 'DE', 'FR', 'ES', 'NL', 'BE', 'AT'],
      maxWeight: 25,
      freeShippingThreshold: 60
    },
    tracking: {
      enabled: true,
      url: 'https://www.ups.com/tracking'
    },
    affiliate: {
      enabled: true,
      commission: 4.0, // 4% commission
      trackingId: 'UPS_AFFILIATE_001'
    }
  },
  {
    id: 'fedex',
    name: 'FedEx',
    logo: '/images/shipping/fedex-logo.png',
    website: 'https://www.fedex.com',
    description: 'Spedizioni premium con garanzia di consegna',
    features: [
      'Consegna garantita',
      'Protezione merce inclusa',
      'Servizio clienti dedicato',
      'Ritiro a domicilio'
    ],
    pricing: {
      standard: 9.99,
      express: 18.99,
      heavy: 29.99
    },
    coverage: {
      countries: ['IT', 'US', 'CA', 'GB', 'DE', 'FR', 'ES'],
      maxWeight: 35,
      freeShippingThreshold: 80
    },
    tracking: {
      enabled: true,
      url: 'https://www.fedex.com/tracking'
    },
    affiliate: {
      enabled: true,
      commission: 3.0, // 3% commission
      trackingId: 'FEDEX_AFFILIATE_001'
    }
  },
  {
    id: 'poste-italiane',
    name: 'Poste Italiane',
    logo: '/images/shipping/poste-logo.png',
    website: 'https://www.poste.it',
    description: 'Spedizioni nazionali ed europee economiche',
    features: [
      'Prezzi competitivi',
      'Copertura capillare',
      'Consegna in 3-7 giorni',
      'Raccomandata inclusa'
    ],
    pricing: {
      standard: 4.99,
      express: 8.99,
      heavy: 15.99
    },
    coverage: {
      countries: ['IT', 'FR', 'DE', 'ES', 'AT', 'CH'],
      maxWeight: 20,
      freeShippingThreshold: 50
    },
    tracking: {
      enabled: true,
      url: 'https://www.poste.it/tracking'
    },
    affiliate: {
      enabled: true,
      commission: 5.0, // 5% commission
      trackingId: 'POSTE_AFFILIATE_001'
    }
  },
  {
    id: 'gls',
    name: 'GLS',
    logo: '/images/shipping/gls-logo.png',
    website: 'https://www.gls-group.eu',
    description: 'Spedizioni europee con focus sulla sostenibilità',
    features: [
      'Spedizioni eco-friendly',
      'Consegna in 2-4 giorni',
      'App mobile per tracking',
      'Punti di ritiro estesi'
    ],
    pricing: {
      standard: 6.99,
      express: 11.99,
      heavy: 19.99
    },
    coverage: {
      countries: ['IT', 'DE', 'FR', 'ES', 'NL', 'BE', 'AT', 'CH', 'GB'],
      maxWeight: 25,
      freeShippingThreshold: 55
    },
    tracking: {
      enabled: true,
      url: 'https://www.gls-group.eu/tracking'
    },
    affiliate: {
      enabled: true,
      commission: 4.5, // 4.5% commission
      trackingId: 'GLS_AFFILIATE_001'
    }
  }
];

// Helper functions
export const getShippingPartners = (country: string, weight: number, orderTotal: number): ShippingPartner[] => {
  return shippingPartners.filter(partner => 
    partner.coverage.countries.includes(country) &&
    weight <= partner.coverage.maxWeight
  );
};

export const getBestShippingOption = (partners: ShippingPartner[], weight: number, orderTotal: number, priority: 'price' | 'speed' | 'reliability' = 'price') => {
  if (partners.length === 0) return null;

  // Check for free shipping first
  const freeShippingPartners = partners.filter(partner => 
    orderTotal >= partner.coverage.freeShippingThreshold
  );

  if (freeShippingPartners.length > 0) {
    return {
      partner: freeShippingPartners[0],
      cost: 0,
      type: 'free',
      estimatedDays: '3-7 giorni'
    };
  }

  // Determine shipping type based on weight
  let shippingType: 'standard' | 'express' | 'heavy' = 'standard';
  if (weight > 5) shippingType = 'heavy';
  else if (weight > 2) shippingType = 'express';

  // Sort partners based on priority
  const sortedPartners = [...partners].sort((a, b) => {
    switch (priority) {
      case 'price':
        return a.pricing[shippingType] - b.pricing[shippingType];
      case 'speed':
        // Express is faster, so lower price for express is better
        return a.pricing.express - b.pricing.express;
      case 'reliability':
        // Sort by commission (higher commission = better partnership)
        return b.affiliate.commission - a.affiliate.commission;
      default:
        return a.pricing[shippingType] - b.pricing[shippingType];
    }
  });

  const bestPartner = sortedPartners[0];
  return {
    partner: bestPartner,
    cost: bestPartner.pricing[shippingType],
    type: shippingType,
    estimatedDays: shippingType === 'express' ? '1-2 giorni' : 
                   shippingType === 'heavy' ? '3-7 giorni' : '2-5 giorni'
  };
};

export const calculateAffiliateCommission = (partner: ShippingPartner, orderTotal: number): number => {
  if (!partner.affiliate.enabled) return 0;
  return (orderTotal * partner.affiliate.commission) / 100;
};

export const generateTrackingUrl = (partner: ShippingPartner, trackingNumber: string): string => {
  return `${partner.tracking.url}?tracking=${trackingNumber}`;
};

// Integration with Stripe shipping options (max 5 options)
export const createStripeShippingOptionsFromPartners = (partners: ShippingPartner[], weight: number, orderTotal: number) => {
  const options: any[] = [];

  // Sort partners by commission (higher commission = better partnership)
  const sortedPartners = [...partners].sort((a, b) => b.affiliate.commission - a.affiliate.commission);

  // Limit to top 3 partners to avoid exceeding Stripe's 5 option limit
  const topPartners = sortedPartners.slice(0, 3);

  topPartners.forEach(partner => {
    // Free shipping option (highest priority)
    if (orderTotal >= partner.coverage.freeShippingThreshold) {
      options.push({
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: {
            amount: 0,
            currency: 'eur',
          },
          display_name: `🎁 Gratuita - ${partner.name}`,
          delivery_estimate: {
            minimum: { unit: 'business_day' as const, value: 3 },
            maximum: { unit: 'business_day' as const, value: 7 }
          },
          metadata: {
            partner_id: partner.id,
            partner_name: partner.name,
            affiliate_tracking: partner.affiliate.trackingId,
            shipping_type: 'free'
          }
        },
      });
    }

    // Determine best shipping option for this partner
    let shippingType: 'standard' | 'express' | 'heavy' = 'standard';
    let shippingCost = partner.pricing.standard;
    let estimatedDays = { min: 2, max: 5 };
    let displayName = `${partner.name} - Standard`;

    if (weight > 5) {
      shippingType = 'heavy';
      shippingCost = partner.pricing.heavy;
      estimatedDays = { min: 3, max: 7 };
      displayName = `${partner.name} - Pesante`;
    } else if (weight > 2) {
      shippingType = 'express';
      shippingCost = partner.pricing.express;
      estimatedDays = { min: 1, max: 2 };
      displayName = `${partner.name} - Express`;
    }

    // Add the best option for this partner
    options.push({
      shipping_rate_data: {
        type: 'fixed_amount' as const,
        fixed_amount: {
          amount: Math.round(shippingCost * 100), // Convert to cents
          currency: 'eur',
        },
        display_name: displayName,
        delivery_estimate: {
          minimum: { unit: 'business_day' as const, value: estimatedDays.min },
          maximum: { unit: 'business_day' as const, value: estimatedDays.max }
        },
        metadata: {
          partner_id: partner.id,
          partner_name: partner.name,
          affiliate_tracking: partner.affiliate.trackingId,
          shipping_type: shippingType
        }
      },
    });
  });

  // Ensure we don't exceed 5 options (Stripe limit)
  return options.slice(0, 5);
};

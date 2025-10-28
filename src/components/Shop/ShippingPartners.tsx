"use client";

import React from 'react';
import { shippingPartners, ShippingPartner } from '@/lib/shippingPartners';

interface ShippingPartnersProps {
  country?: string;
  weight?: number;
  orderTotal?: number;
  className?: string;
}

const ShippingPartners: React.FC<ShippingPartnersProps> = ({
  country = 'IT',
  weight = 1,
  orderTotal = 0,
  className = ''
}) => {
  // Get available partners for the given parameters
  const availablePartners = shippingPartners.filter(partner => 
    partner.coverage.countries.includes(country) &&
    weight <= partner.coverage.maxWeight
  );

  if (availablePartners.length === 0) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Spedizione non disponibile
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Non ci sono corrieri disponibili per questa destinazione e peso.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🚚 Corrieri Partner Disponibili
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          Scegli tra i nostri corrieri affiliati per spedizioni sicure e tracciabili.
        </p>
        
        <div className="grid gap-3">
          {availablePartners.map((partner) => (
            <ShippingPartnerCard 
              key={partner.id} 
              partner={partner} 
              weight={weight}
              orderTotal={orderTotal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ShippingPartnerCardProps {
  partner: ShippingPartner;
  weight: number;
  orderTotal: number;
}

const ShippingPartnerCard: React.FC<ShippingPartnerCardProps> = ({
  partner,
  weight,
  orderTotal
}) => {
  const hasFreeShipping = orderTotal >= partner.coverage.freeShippingThreshold;
  
  // Determine best shipping option
  let shippingType: 'standard' | 'express' | 'heavy' = 'standard';
  let shippingCost = partner.pricing.standard;
  let estimatedDays = '2-5 giorni';
  
  if (weight > 5) {
    shippingType = 'heavy';
    shippingCost = partner.pricing.heavy;
    estimatedDays = '3-7 giorni';
  } else if (weight > 2) {
    shippingType = 'express';
    shippingCost = partner.pricing.express;
    estimatedDays = '1-2 giorni';
  }

  if (hasFreeShipping) {
    shippingCost = 0;
    estimatedDays = '3-7 giorni';
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">
                {partner.name.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{partner.name}</h4>
              <p className="text-sm text-gray-600">{partner.description}</p>
            </div>
          </div>
          
          <div className="space-y-1 mb-3">
            {partner.features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {hasFreeShipping ? (
              <span className="text-green-600">Gratis</span>
            ) : (
              `€${shippingCost.toFixed(2)}`
            )}
          </div>
          <div className="text-sm text-gray-600">{estimatedDays}</div>
          {hasFreeShipping && (
            <div className="text-xs text-green-600 font-medium">
              Spedizione gratuita
            </div>
          )}
        </div>
      </div>
      
      {partner.affiliate.enabled && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Partner affiliato</span>
            <span>{partner.affiliate.commission}% commissione</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingPartners;

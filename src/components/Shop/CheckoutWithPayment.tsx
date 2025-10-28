"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import PaymentMethodSelector, { PaymentMethod } from './PaymentMethodSelector';
import SimpleStripeCheckout from './SimpleStripeCheckout';
import OrderReview from './OrderReview';
import { Customer, ShippingAddress } from '@/types/order';

interface CheckoutWithPaymentProps {
  customer: Customer;
  shippingAddress: ShippingAddress;
  onBack: () => void;
}

const CheckoutWithPayment = ({ customer, shippingAddress, onBack }: CheckoutWithPaymentProps) => {
  const { state } = useCart();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe_checkout');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payment/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: state.total + 5, // Add shipping cost
            currency: 'eur',
            metadata: {
              customerEmail: customer.email,
              orderNumber: `ORD-${Date.now()}`,
            },
          }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Errore nella creazione del pagamento');
      }
    };

    if (selectedMethod === 'stripe') {
      createPaymentIntent();
    }
  }, [state.total, customer.email, selectedMethod]);

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Here you would typically save the order to your database
      // For now, we'll just redirect to success page
      const orderNumber = `ORD-${Date.now()}`;
      router.push(`/shop/success?orderNumber=${orderNumber}`);
    } catch (err) {
      console.error('Error processing successful payment:', err);
      setError('Errore nell\'elaborazione del pagamento');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };


  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-red-800">Errore di Pagamento</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <button
          onClick={() => setError(null)}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Payment Method Selection */}
      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
      />

      {/* Customer and Shipping Info Review */}
      <div className="bg-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Riepilogo Informazioni
        </h3>
        <div className="space-y-4">
          <div className="bg-white/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Informazioni Cliente</h4>
            <p className="text-sm text-gray-700">{customer.firstName} {customer.lastName}</p>
            <p className="text-sm text-gray-700">{customer.email}</p>
            <p className="text-sm text-gray-700">{customer.phone}</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Indirizzo di Spedizione</h4>
            <p className="text-sm text-gray-700">{shippingAddress.address}</p>
            <p className="text-sm text-gray-700">{shippingAddress.city}, {shippingAddress.postalCode}</p>
            <p className="text-sm text-gray-700">{shippingAddress.country}</p>
          </div>
        </div>
      </div>

      {/* Payment Form - Solo Stripe Checkout */}
      {selectedMethod === 'stripe_checkout' && (
        <SimpleStripeCheckout
          customerEmail={customer.email}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition"
        >
          ← Torna indietro
        </button>
      </div>
    </div>
  );
};

export default CheckoutWithPayment;

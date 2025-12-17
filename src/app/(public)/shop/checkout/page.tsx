"use client";

import dynamic from 'next/dynamic';
import { useCart } from '@/contexts/CartContext';
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';
import Image from 'next/image';

// Lazy load del componente Stripe checkout (libreria pesante)
const SimpleStripeCheckout = dynamic(() => import('@/components/Shop/SimpleStripeCheckout'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
      <p className="text-gray-600">Caricamento checkout...</p>
    </div>
  ),
});

const CheckoutPage = () => {
  const { state } = useCart();

  const handlePaymentSuccess = (sessionId: string) => {
    window.location.href = `/shop/success?session_id=${sessionId}`;
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert('Errore durante il pagamento. Riprova.');
  };

  if (state.items.length === 0) {
    return (
      <>
        <div className=" from-gray-800 via-gray-400 to-white text-black">
          <Breadcrumb
            pageName="Checkout"
            description="Il tuo carrello è vuoto"
          />
        </div>

        <div className=" from-white via-blue-100 to-blue-400 text-black">
          <section className="py-16 lg:py-20">
            <div className="container">
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-black mb-4">
                  Carrello vuoto
                </h1>
                <p className="text-black/80 text-lg mb-8">
                  Non puoi procedere al checkout con un carrello vuoto.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Torna allo Shop
                </Link>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <div className=" from-gray-800 via-gray-400 to-white text-black">
        <Breadcrumb
          pageName="Checkout"
          description="Completa il tuo ordine"
        />
      </div>

      <div className=" from-white via-blue-100 to-blue-400 text-black">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl mb-4">
                  Checkout
                </h1>
                <p className="text-black/80 text-lg">
                  Procedi al pagamento sicuro con Stripe
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Pagamento Sicuro
                          </h2>
                    <p className="text-gray-600 mb-6">
                      Clicca il pulsante qui sotto per procedere al pagamento sicuro con Stripe. 
                      Potrai inserire i tuoi dati di spedizione e pagamento direttamente sulla piattaforma Stripe.
                    </p>
                    
                    <SimpleStripeCheckout
                      customerEmail=""
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-lg p-6 sticky top-8">
                    <h3 className="text-xl font-bold text-black mb-6">
                      Riepilogo Ordine
                    </h3>

                    <div className="space-y-4 mb-6">
                      {state.items.map((item, index) => {
                        const productName = item.product.name || item.product.title || 'Prodotto senza nome';
                        const productImage = item.product.images && item.product.images.length > 0
                          ? item.product.images[0]
                          : (item.product.mainImage ? item.product.mainImage : '/images/blog/blog-01.jpg');
                        const productPrice = item.product.price?.unit_amount 
                          ? (item.product.price.unit_amount / 100) 
                          : (typeof item.product.price === 'number' ? item.product.price : 0);

                        return (
                          <div key={item.product.id || index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                            <div className="relative w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                              {productImage && productImage.startsWith('http') ? (
                                <Image
                                  src={productImage}
                                  alt={productName}
                                  fill
                                  className="object-cover rounded-lg"
                                  sizes="48px"
                                />
                              ) : (
                                <span className="text-xs text-gray-600">IMG</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {productName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                              €{(productPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotale:</span>
                        <span className="font-medium">€{state.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spese di imballo:</span>
                        <span className="font-medium">€{Math.max(state.total * 0.005, 2).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-black">Totale:</span>
                          <span className="text-lg font-bold text-primary">€{(state.total + Math.max(state.total * 0.005, 2)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                      <Link
                        href="/shop/cart"
                        className="w-full mt-6 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center block"
                      >
                        Torna al Carrello
                      </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CheckoutPage;

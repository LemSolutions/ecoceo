"use client";

import { useCart } from '@/contexts/CartContext';
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

const CartPage = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isCheckoutMaintenanceOpen, setIsCheckoutMaintenanceOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    setIsUpdating(productId);
    try {
      updateQuantity(productId, newQuantity);
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsUpdating(null);
    }
  };

  if (state.items.length === 0) {
    return (
      <>
        {/* Breadcrumb Section - Gradiente da grigio scuro a bianco */}
        <div className=" from-gray-800 via-gray-400 to-white text-black">
          <Breadcrumb
            pageName="Carrello"
            description="Il tuo carrello è vuoto"
            parentPages={[{ name: 'Shop', href: '/shop' }]}
          />
        </div>

        {/* Empty Cart Content - Gradiente da bianco ad arancione intenso */}
        <div className=" from-white via-blue-100 to-blue-400 text-black">
          <section className="py-16 lg:py-20">
            <div className="container">
              <div className="text-center py-12">
                <div className="mb-8">
                  <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-black mb-4">
                  Il tuo carrello è vuoto
                </h1>
                <p className="text-black/80 text-lg mb-8 max-w-md mx-auto">
                  Sembra che tu non abbia ancora aggiunto nessun prodotto al carrello.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Inizia a fare shopping
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
      {/* Breadcrumb Section - Gradiente da grigio scuro a bianco */}
      <div className=" from-gray-800 via-gray-400 to-white text-black">
        <Breadcrumb
          pageName="Carrello"
          description={`${state.itemCount} articoli nel carrello`}
          parentPages={[{ name: 'Shop', href: '/shop' }]}
        />
      </div>

      {/* Cart Content - Gradiente da bianco ad arancione intenso */}
      <div className=" from-white via-blue-100 to-blue-400 text-black">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl mb-4">
                  Il tuo Carrello
                </h1>
                <p className="text-black/80 text-lg">
                  {state.itemCount} articoli nel carrello
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-black">
                        Prodotti ({state.items.length})
                      </h2>
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        Svuota carrello
                      </button>
                    </div>

                    <div className="space-y-6">
                      {state.items.map((item) => {
                        const productPrice = item.product.price.unit_amount / 100;
                        const productImage = item.product.images && item.product.images.length > 0 
                          ? item.product.images[0] 
                          : '/images/blog/blog-01.jpg';
                        const productName = item.product.name || 'Prodotto senza nome';
                        
                        return (
                          <div key={item.product.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                            {/* Product Image */}
                            <div className="flex-shrink-0 relative w-20 h-20">
                              <Image
                                src={productImage}
                                alt={productName}
                                fill
                                className="object-cover rounded-lg"
                                sizes="80px"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-black truncate">
                                {productName}
                              </h3>
                              <p className="text-base text-gray-600 mt-1.5">
                                {productName.toLowerCase().includes('2kg') || productName.toLowerCase().includes('ceramic toner') ? '2Kg' : '100 SHEETS'}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-lg font-bold text-primary">
                                  {formatPrice(productPrice)}
                                </span>
                                {item.product.metadata?.comparePrice && 
                                 parseFloat(item.product.metadata.comparePrice) > productPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(parseFloat(item.product.metadata.comparePrice))}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                disabled={isUpdating === item.product.id || item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              
                              <span className="w-12 text-center font-medium">
                                {isUpdating === item.product.id ? (
                                  <svg className="animate-spin h-4 w-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                disabled={isUpdating === item.product.id || (item.product.stock && item.quantity >= item.product.stock)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-red-600 hover:text-red-800 p-2 transition-colors"
                              title="Rimuovi dal carrello"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6 sticky top-4">
                    <h2 className="text-xl font-bold text-black mb-6">
                      Riepilogo Ordine
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotale:</span>
                        <span className="font-medium">{formatPrice(state.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spese di spedizione:</span>
                        <span className="font-medium text-green-600">Gratis</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-black">Totale:</span>
                          <span className="text-lg font-bold text-primary">{formatPrice(state.total)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCheckoutMaintenanceOpen(true)}
                      className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center block"
                    >
                      Procedi al Checkout
                    </button>

                    <Link
                      href="/shop"
                      className="w-full mt-4 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center block"
                    >
                      Continua lo Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Checkout Maintenance Modal */}
      {isCheckoutMaintenanceOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Checkout in manutenzione"
          onClick={() => setIsCheckoutMaintenanceOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-7.4 12.84A2 2 0 004.62 20h14.76a2 2 0 001.73-3.3l-7.4-12.84a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Checkout momentaneamente non disponibile</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Al momento il checkout è in fase di manutenzione per migliorare la sicurezza e l’esperienza di acquisto.
                  Puoi comunque aggiungere prodotti al carrello e tornare più tardi a completare l’ordine.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl bg-gray-900 text-white py-2.5 font-semibold hover:bg-gray-800 transition"
                onClick={() => setIsCheckoutMaintenanceOpen(false)}
              >
                Ok, ho capito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;

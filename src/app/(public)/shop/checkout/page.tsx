"use client";

import { useCart } from '@/contexts/CartContext';
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';

const CheckoutPage = () => {
  const { state } = useCart();

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
          <section className="pt-20 pb-16 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20">
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
          description="Servizio in manutenzione"
        />
      </div>

      <div className=" from-white via-blue-100 to-blue-400 text-black">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/60 backdrop-blur rounded-2xl shadow-xl p-6 md:p-10 border border-white/60">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-700 flex-shrink-0">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-7.4 12.84A2 2 0 004.62 20h14.76a2 2 0 001.73-3.3l-7.4-12.84a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Checkout in manutenzione
                    </h1>
                    <p className="mt-3 text-gray-700 leading-relaxed">
                      Al momento il checkout è in fase di manutenzione per migliorare la sicurezza e l’esperienza di acquisto.
                      Il carrello resta disponibile: puoi aggiungere prodotti e tornare più tardi per completare l’ordine.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/shop/cart"
                        className="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-6 py-3 font-semibold hover:bg-gray-800 transition"
                      >
                        Torna al Carrello
                      </Link>
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-white text-gray-900 px-6 py-3 font-semibold border border-gray-200 hover:bg-gray-50 transition"
                      >
                        Torna alla Home
                      </Link>
                    </div>
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

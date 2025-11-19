"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { safeFetch } from '@/sanity/lib/client';
import { spotlightOfferQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';

const STORAGE_KEY = 'offers_spotlight_seen';

type SpotlightOffer = {
  _id: string;
  title: string;
  subtitle?: string;
  highlight?: string;
  badge?: string;
  description?: string;
  mainImage?: any;
  ctaLabel?: string;
  ctaUrl?: string;
  slug?: { current?: string };
};

const OffersSpotlightPopup = () => {
  const [offer, setOffer] = useState<SpotlightOffer | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const data = await safeFetch(spotlightOfferQuery);
        if (data?._id) {
          setOffer(data);
          const seen = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'true';
          if (!seen) {
            setTimeout(() => setIsOpen(true), 1200);
          }
        }
      } catch (error) {
        console.error('Error fetching spotlight offer', error);
      }
    };

    fetchOffer();
  }, []);

  if (!offer || !isOpen) return null;

  const close = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const handlePrimary = () => {
    close();
  };

  const detailUrl = offer.slug?.current ? `/offerte/${offer.slug.current}` : '/offerte';
  const ctaHref =
    offer.ctaUrl ||
    'mailto:commerciale@lemsolutions.it?subject=Offerta Speciale Fotoceramica';

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9996]"
        onClick={close}
      />
      <div className="fixed inset-0 z-[9997] flex items-center justify-center px-4">
        <div className="relative max-w-5xl w-full bg-gradient-to-br from-orange-600 via-red-600 to-rose-600 text-white rounded-[36px] shadow-2xl overflow-hidden">
          <button
            aria-label="Chiudi popup offerte"
            onClick={close}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-10 flex flex-col justify-center space-y-6">
              {offer.highlight && (
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/80">
                  <span className="h-px w-8 bg-white/60" />
                  {offer.highlight}
                </span>
              )}
              <div>
                <h2 className="text-3xl sm:text-4xl font-black leading-tight drop-shadow-[0_15px_40px_rgba(0,0,0,0.35)]">
                  {getTextValue(offer.title)}
                </h2>
                {offer.subtitle && (
                  <p className="mt-3 text-lg text-white/80">
                    {getTextValue(offer.subtitle)}
                  </p>
                )}
              </div>
              {offer.description && (
                <p className="text-base text-white/80 leading-relaxed">
                  {getTextValue(offer.description)}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={ctaHref}
                  onClick={handlePrimary}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-white text-orange-600 font-semibold py-3 text-sm uppercase tracking-wide shadow-lg shadow-black/30 hover:scale-[1.01] transition"
                >
                  {offer.ctaLabel || 'Richiedi Preventivo'}
                </Link>
                <Link
                  href={detailUrl}
                  onClick={handlePrimary}
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-white/10"
                >
                  Dettagli Offerta
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              {offer.mainImage ? (
                <Image
                  src={getImageUrl(offer.mainImage)}
                  alt={getTextValue(offer.title)}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-black/20 flex items-center justify-center text-white/70 text-lg">
                  Fotoceramica su misura
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OffersSpotlightPopup;


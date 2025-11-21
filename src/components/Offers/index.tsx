"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { safeFetch } from '@/sanity/lib/client';
import {
  homepageOffersQuery,
  offersArchiveQuery,
} from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';

type Offer = {
  _id: string;
  title: string;
  subtitle?: string;
  slug?: { current?: string };
  highlight?: string;
  badge?: string;
  mainImage?: any;
  description?: string;
  priceOriginal?: number;
  priceDiscounted?: number;
  ctaLabel?: string;
  ctaUrl?: string;
};

interface OffersProps {
  variant?: 'homepage' | 'archive';
  heading?: string;
  subheading?: string;
}

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return null;
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(value);
};

const Offers: React.FC<OffersProps> = ({
  variant = 'homepage',
  heading,
  subheading,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const isHomepage = variant === 'homepage';

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const query =
          variant === 'homepage' ? homepageOffersQuery : offersArchiveQuery;
        const offersData = await safeFetch(query);
        setOffers(offersData || []);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [variant]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/80 text-lg">Caricamento offerte...</p>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Nessuna offerta disponibile
        </h3>
        <p className="text-white/70 mb-8">
          Torna a visitarci presto per scoprire le nuove promozioni dedicate alla
          fotoceramica professionale.
        </p>
      </div>
    );
  }

  const sectionHeading =
    heading || (isHomepage ? 'Offerte Attive' : 'Le Nostre Offerte');
  const sectionSubheading =
    subheading ||
    (isHomepage
      ? 'Promozioni e bundle dedicati alla produzione di fotoceramiche industriali.'
      : 'Scegli l’offerta più adatta al tuo laboratorio o studio creativo.');

  return (
    <div className="text-white">
      <div className="text-center mb-12">
        <p className="uppercase tracking-[0.3em] text-orange-300 text-sm font-semibold mb-3">
          Offerte speciali
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl mb-4">
          {sectionHeading}
        </h2>
        <p className="text-white/80 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
          {sectionSubheading}
        </p>
      </div>

      <div
        className={`grid gap-8 ${
          isHomepage
            ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-fr'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {offers.map((offer, index) => {
          const isSpotlight = isHomepage && index === 0;
          const discounted = formatCurrency(offer.priceDiscounted);
          const original = formatCurrency(offer.priceOriginal);
          const slugPath =
            offer.slug?.current && variant === 'archive'
              ? `/offerte/${offer.slug.current}`
              : offer.slug?.current
              ? `/offerte/${offer.slug.current}`
              : undefined;

          return (
            <div
              key={offer._id}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-2 ${
                isSpotlight
                  ? 'lg:col-span-2 xl:col-span-3 bg-gradient-to-r from-white/15 via-white/5 to-white/10 shadow-[0_50px_120px_-45px_rgba(0,0,0,0.95)] lg:flex lg:min-h-[420px] animate-offer-glow'
                  : 'bg-white/10 backdrop-blur-lg shadow-[0_25px_60px_-30px_rgba(0,0,0,0.8)]'
              }`}
            >
              <div
                className={`relative overflow-hidden group ${
                  isSpotlight
                    ? 'h-72 lg:h-auto lg:min-h-[420px] lg:w-1/2 bg-black/30 flex items-center justify-center'
                    : 'h-56'
                }`}
              >
                {offer.mainImage ? (
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={getImageUrl(offer.mainImage)}
                      alt={getTextValue(offer.title)}
                      fill
                      className="transition-all duration-500 ease-out object-cover group-hover:scale-95 group-hover:object-contain"
                      sizes={
                        isSpotlight
                          ? '(min-width: 1280px) 45vw, (min-width: 1024px) 55vw, 100vw'
                          : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
                      }
                      priority={isSpotlight}
                    />
                  </div>
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-orange-400/60 to-red-500/80 flex items-center justify-center text-white font-semibold text-lg">
                    Fotoceramica premium
                  </div>
                )}
                <div
                  className={`absolute inset-0 ${
                    isSpotlight
                      ? 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'
                      : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
                  }`}
                />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {offer.highlight && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
                      {offer.highlight}
                    </span>
                  )}
                  {offer.badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-orange-500/60">
                      {offer.badge}
                    </span>
                  )}
                </div>
              </div>

              <div
                className={`p-6 space-y-4 ${
                  isSpotlight
                    ? 'lg:w-1/2 lg:p-8 lg:space-y-6'
                    : ''
                }`}
              >
                <div>
                  <h3
                    className={`font-bold mb-2 ${
                      isSpotlight ? '!text-black text-3xl lg:text-4xl' : 'text-2xl text-white'
                    }`}
                  >
                    {getTextValue(offer.title)}
                  </h3>
                  {offer.subtitle && (
                    <p
                      className={`text-white/70 uppercase tracking-widest ${
                        isSpotlight ? 'text-base' : 'text-sm'
                      }`}
                    >
                      {getTextValue(offer.subtitle)}
                    </p>
                  )}
                </div>

                {offer.description && (
                  <p
                    className={`text-white/80 leading-relaxed ${
                      isSpotlight ? 'text-lg line-clamp-4' : 'text-base line-clamp-3'
                    }`}
                  >
                    {getTextValue(offer.description)}
                  </p>
                )}

                {(discounted || original) && (
                  <div className="flex items-end gap-3">
                    {discounted && (
                      <span className="text-3xl font-bold text-orange-300">
                        {discounted}
                      </span>
                    )}
                    {original && (
                      <span className="text-base text-white/60 line-through">
                        {original}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={
                      offer.ctaUrl ||
                      'mailto:commerciale@lemsolutions.it?subject=OFFERTA FOTOCERAMICA'
                    }
                    className="flex-1 inline-flex justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:brightness-110"
                  >
                    {offer.ctaLabel || 'Richiedi Preventivo'}
                  </Link>

                  {slugPath && (
                    <Link
                      href={slugPath}
                      className="group inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur shadow-lg transition-all"
                    >
                      Dettagli
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes offerGlow {
          0% {
            box-shadow: 0 45px 120px -45px rgba(255, 140, 0, 0.35);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 55px 140px -45px rgba(255, 195, 120, 0.6);
            transform: translateY(-6px);
          }
          100% {
            box-shadow: 0 45px 120px -45px rgba(255, 140, 0, 0.35);
            transform: translateY(0);
          }
        }

        .animate-offer-glow {
          animation: offerGlow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Offers;


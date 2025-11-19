"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { safeFetch } from '@/sanity/lib/client';
import { offerBySlugQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

const OfferDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const data = await safeFetch(offerBySlugQuery, { slug });
        setOffer(data);
      } catch (error) {
        console.error('Error fetching offer', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchOffer();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-16 text-white">
        Caricamento offerta...
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-16 text-white">
        <p className="text-2xl font-semibold mb-6">Offerta non trovata</p>
        <Link
          href="/offerte"
          className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition"
        >
          Torna alle Offerte
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-white">
        <Breadcrumb
          pageName={getTextValue(offer.title)}
          description={getTextValue(offer.subtitle) || 'Offerta speciale'}
        />
      </div>

      <section className="py-16 lg:py-24 text-white">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
            <article className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {offer.mainImage && (
                <div className="relative h-80">
                  <Image
                    src={getImageUrl(offer.mainImage)}
                    alt={getTextValue(offer.title)}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              <div className="p-8 lg:p-10 space-y-6">
                {offer.highlight && (
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-orange-300">
                    <span className="h-px w-6 bg-orange-200" />
                    {offer.highlight}
                  </span>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold">
                  {getTextValue(offer.title)}
                </h1>
                {offer.description && (
                  <p className="text-white/80 text-lg leading-relaxed">
                    {getTextValue(offer.description)}
                  </p>
                )}

                {offer.details && (
                  <div className="prose prose-invert max-w-none">
                    <PortableText value={offer.details} />
                  </div>
                )}
              </div>
            </article>

            <aside className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 shadow-xl">
              {(offer.priceDiscounted || offer.priceOriginal) && (
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-white/60 mb-2">
                    Investimento
                  </p>
                  <div className="flex items-end gap-3">
                    {offer.priceDiscounted && (
                      <span className="text-4xl font-bold text-orange-300">
                        €
                        {new Intl.NumberFormat('it-IT', {
                          minimumFractionDigits: 0,
                        }).format(offer.priceDiscounted)}
                      </span>
                    )}
                    {offer.priceOriginal && (
                      <span className="text-lg text-white/50 line-through">
                        €
                        {new Intl.NumberFormat('it-IT', {
                          minimumFractionDigits: 0,
                        }).format(offer.priceOriginal)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  href={
                    offer.ctaUrl ||
                    'mailto:commerciale@lemsolutions.it?subject=Offerta Fotoceramica'
                  }
                  className="w-full inline-flex justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/50 hover:brightness-110"
                >
                  {offer.ctaLabel || 'Richiedi Preventivo'}
                </Link>
                <Link
                  href="/offerte"
                  className="w-full inline-flex justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                >
                  Torna alle Offerte
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default OfferDetailPage;


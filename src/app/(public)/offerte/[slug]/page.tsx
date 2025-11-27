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
          showIntro={false}
        />
      </div>

      <section className="py-16 lg:py-24 text-white">
        <div className="container">
          <div className="space-y-10">
            <article className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {offer.mainImage && (
                <div className="relative h-[420px] overflow-hidden bg-gradient-to-br from-black via-black/70 to-black/40 rounded-b-[36px]">
                  <div className="absolute inset-0 opacity-40 blur-3xl bg-gradient-to-r from-orange-500/40 via-rose-500/30 to-transparent" />
                  <div className="absolute inset-0 opacity-30 blur-3xl bg-gradient-to-l from-blue-600/40 via-purple-500/20 to-transparent" />
                  <div className="relative h-full w-full flex items-center justify-center">
                    <div className="relative h-full w-full">
                      <Image
                        src={getImageUrl(offer.mainImage)}
                        alt={getTextValue(offer.title)}
                        fill
                        className="object-contain p-6"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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

                {(offer.priceDiscounted || offer.priceOriginal) && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                      <Link
                        href={
                          offer.ctaUrl ||
                          'mailto:commerciale@lemsolutions.it?subject=Offerta Fotoceramica'
                        }
                        className="flex-1 sm:flex-none sm:min-w-[240px] inline-flex justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-orange-500/40 hover:brightness-110 whitespace-nowrap"
                      >
                        {offer.ctaLabel || 'Richiedi Preventivo'}
                      </Link>
                      <Link
                        href="/offerte"
                        className="flex-1 inline-flex items-center justify-center rounded-full border border-blue-400/30 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-xl"
                      >
                        Torna alle Offerte
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default OfferDetailPage;


"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { safeFetch } from '@/sanity/lib/client';
import { novitaBySlugQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';

// Dynamic import di PortableText per evitare problemi di SSR con React 19
const PortableText = dynamic(
  () => import('@portabletext/react').then((mod) => mod.PortableText),
  { ssr: false }
);

const NovitaDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [novita, setNovita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNovita = async () => {
      try {
        const novitaData = await safeFetch(novitaBySlugQuery, { slug });
        setNovita(novitaData);
      } catch (error) {
        console.error('Error fetching novità data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNovita();
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <Breadcrumb
          pageName="Novità"
          description="Caricamento..."
        />
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-gray-600">Caricamento novità...</p>
        </div>
      </>
    );
  }

  if (!novita) {
    return (
      <>
        <Breadcrumb
          pageName="Novità"
          description="Novità non trovata"
        />
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Novità non trovata</h3>
            <p className="text-gray-600 mb-6">La novità che stai cercando non esiste o è stata rimossa.</p>
            <Link
              href="/novita"
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Torna all'Archivio Novità
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <div>
        <Breadcrumb
          pageName={getTextValue(novita.title)}
          description={getTextValue(novita.subtitle) || "Dettaglio novità"}
        />
      </div>

      {/* Novità Detail Content */}
      <div>
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Article Header */}
              <article className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-2xl shadow-lg overflow-hidden">
                {/* Hero Image */}
                {novita.mainImage && (
                  <div className="relative aspect-[21/9] overflow-hidden">
                    <img
                      src={getImageUrl(novita.mainImage)}
                      alt={getTextValue(novita.title)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                )}

                {/* Article Content */}
                <div className="p-8 lg:p-12">
                  {/* Title */}
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {getTextValue(novita.title)}
                  </h1>

                  {/* Subtitle */}
                  {novita.subtitle && (
                    <h2 className="text-xl lg:text-2xl text-gray-600 mb-8">
                      {getTextValue(novita.subtitle)}
                    </h2>
                  )}

                  {/* Meta Information */}
                  {novita._createdAt && (
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {new Date(novita._createdAt).toLocaleDateString('it-IT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mini Intro (if available) */}
                  {novita.miniIntro && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                      <p className="text-gray-700 italic leading-relaxed">
                        {getTextValue(novita.miniIntro)}
                      </p>
                    </div>
                  )}

                  {/* Full Content */}
                  <div className="prose prose-lg max-w-none">
                    {novita.fullContent && novita.fullContent.length > 0 ? (
                      <PortableText
                        value={novita.fullContent}
                        components={{
                          block: {
                            h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>,
                            h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>,
                            h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h3>,
                            h4: ({children}) => <h4 className="text-lg font-bold text-gray-900 mb-2 mt-4">{children}</h4>,
                            normal: ({children}) => <p className="text-gray-700 leading-relaxed mb-6">{children}</p>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 my-6">{children}</blockquote>,
                          },
                          list: {
                            bullet: ({children}) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">{children}</ul>,
                            number: ({children}) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">{children}</ol>,
                          },
                          listItem: ({children}) => <li className="text-gray-700">{children}</li>,
                          types: {
                            image: ({value}) => (
                              <div className="my-8">
                                <img
                                  src={getImageUrl(value)}
                                  alt={value.alt || ''}
                                  className="w-full rounded-lg"
                                />
                                {value.alt && (
                                  <p className="text-sm text-gray-500 mt-2 text-center">{value.alt}</p>
                                )}
                              </div>
                            ),
                          },
                        }}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Contenuto non disponibile</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>

              {/* Back to Archive Button */}
              <div className="text-center mt-12">
                <Link
                  href="/novita"
                  className="inline-flex items-center bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Torna all'Archivio Novità
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NovitaDetailPage;


"use client";

import Image from "next/image";
import { safeFetch } from '@/sanity/lib/client';
import { allAboutPostsQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useState, useEffect } from 'react';

const AllAboutPosts = () => {
  const [aboutPosts, setAboutPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutPosts = async () => {
      try {
        console.log('🔄 Fetching all about posts...');
        const posts = await safeFetch(allAboutPostsQuery);
        console.log('📊 About posts fetched:', posts);
        setAboutPosts(posts || []);
      } catch (error) {
        console.error('❌ Error fetching about posts:', error);
        setAboutPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Caricamento contenuti About...</p>
      </div>
    );
  }

  if (!aboutPosts || aboutPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-white text-2xl font-bold mb-4">Nessun Contenuto About Trovato</h3>
        <p className="text-white/80 mb-6">
          Non ci sono ancora contenuti About pubblicati. Vai a Sanity Studio per creare i tuoi contenuti.
        </p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Vai a Sanity Studio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {aboutPosts.map((about, index) => (
        <article key={about._id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-white/10">
          {/* Header con badge */}
          <div className="flex justify-between items-start mb-6">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
              #{index + 1}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              about.isActive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {about.isActive ? '✓ Attivo' : '○ Inattivo'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contenuto Testo */}
            <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              {/* Titolo */}
              <h3 className="text-white mb-4 text-3xl font-bold leading-tight">
                {getTextValue(about.title) || 'Titolo About'}
              </h3>
              
              {about.subtitle && (
                <p className="text-blue-400 text-lg font-medium mb-6">
                  {getTextValue(about.subtitle)}
                </p>
              )}

              {/* Descrizione */}
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                {getTextValue(about.description) || 'Descrizione non disponibile.'}
              </p>

              {/* Features */}
              {about.features && about.features.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-white text-xl font-semibold mb-4 flex items-center">
                    ⭐ Caratteristiche
                  </h4>
                  <div className="space-y-3">
                    {about.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <span className="bg-blue-500/20 text-blue-400 mr-4 flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 mt-1">
                          {feature.icon || '✓'}
                        </span>
                        <div>
                          <p className="text-white text-lg font-semibold">
                            {getTextValue(feature.title)}
                          </p>
                          {feature.description && (
                            <p className="text-white/70 text-base leading-relaxed">
                              {getTextValue(feature.description)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistiche */}
              {about.stats && about.stats.length > 0 && (
                <div>
                  <h4 className="text-white text-xl font-semibold mb-4 flex items-center">
                    📊 Statistiche
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {about.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center p-4 bg-white/10 rounded-lg">
                        <p className="text-2xl font-bold text-white mb-1">
                          {getTextValue(stat.number)}
                        </p>
                        <p className="text-white/80 text-sm">
                          {getTextValue(stat.label)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Immagine */}
            <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="relative aspect-4/3">
                {about.image ? (
                  <Image
                    src={getImageUrl(about.image)}
                    alt={getTextValue(about.title) || 'About Image'}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4 opacity-80">📄</div>
                      <p className="text-white/70">Immagine non disponibile</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default AllAboutPosts;

"use client";

import { safeFetch } from '@/sanity/lib/client';
import { novitaQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from "@/components/Common/Breadcrumb";

const NovitaArchivePage = () => {
  const [novita, setNovita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const filterOptions = ['Ceramic Toner', 'Pronto Decal', 'Paper Film'];

  useEffect(() => {
    const fetchNovita = async () => {
      try {
        const novitaData = await safeFetch(novitaQuery);
        setNovita(novitaData || []);
      } catch (error) {
        console.error('Error fetching novità data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovita();
  }, []);

  // Filter novità based on search and selected filter
  const filteredNovita = novita.filter(item => {
    const matchesSearch = getTextValue(item.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getTextValue(item.subtitle).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getTextValue(item.miniIntro).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !selectedFilter || 
                         getTextValue(item.title).toLowerCase().includes(selectedFilter.toLowerCase()) ||
                         getTextValue(item.subtitle).toLowerCase().includes(selectedFilter.toLowerCase()) ||
                         getTextValue(item.miniIntro).toLowerCase().includes(selectedFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNovita.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNovita = filteredNovita.slice(startIndex, endIndex);

  if (loading) {
    return (
      <>
        <Breadcrumb
          pageName="Novità"
          description="Le ultime novità e aggiornamenti"
        />
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-gray-600">Caricamento novità...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        pageName="Novità"
        description="Le ultime novità e aggiornamenti"
      />

      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="space-y-12">
            {/* Search Section */}
            <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Search and Reset Button */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Cerca novità..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFilter('');
                      setSearchTerm('');
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedFilter === ''
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white/80 backdrop-blur-sm text-primary hover:bg-white/90 hover:shadow-sm border border-white/50'
                    }`}
                  >
                    Tutti
                  </button>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-end">
                  <p className="text-gray-600">
                    {filteredNovita.length === 1 
                      ? '1 novità trovata' 
                      : `${filteredNovita.length} novità trovate`
                    }
                  </p>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(selectedFilter === filter ? '' : filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedFilter === filter
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white/80 backdrop-blur-sm text-primary hover:bg-white/90 hover:shadow-sm border border-white/50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* No Results */}
            {filteredNovita.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nessun risultato trovato</h3>
                  <p className="text-gray-600 mb-6">
                    {novita.length === 0 
                      ? 'Non ci sono novità disponibili al momento.'
                      : 'Prova a modificare i termini di ricerca.'
                    }
                  </p>
                  {novita.length === 0 && (
                    <button 
                      onClick={() => window.location.href = '/studio'}
                      className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Vai a Sanity Studio
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Novità Grid */}
            {filteredNovita.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentNovita.map((item, index) => (
                    <article
                      key={item._id || index}
                      className="group bg-white/30 backdrop-blur/30 backdrop-blur rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {/* Image */}
                      <Link href={`/novita/${item.slug?.current || item._id}`}>
                        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                          {item.mainImage ? (
                            <img
                              src={getImageUrl(item.mainImage)}
                              alt={getTextValue(item.title)}
                              className="w-full h-full object-contain pt-6 pb-2 px-3 group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6">
                        {/* Title */}
                        <Link href={`/novita/${item.slug?.current || item._id}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {getTextValue(item.title)}
                          </h3>
                        </Link>

                        {/* Subtitle */}
                        {item.subtitle && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                            {getTextValue(item.subtitle)}
                          </p>
                        )}

                        {/* Mini Intro */}
                        {item.miniIntro && (
                          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                            {getTextValue(item.miniIntro)}
                          </p>
                        )}

                        {/* Read More */}
                        <Link 
                          href={`/novita/${item.slug?.current || item._id}`}
                          className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
                        >
                          Leggi di più
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white/30 backdrop-blur/30 backdrop-blur border border-gray-300 rounded-lg hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Precedente
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'text-gray-500 bg-white/30 backdrop-blur/30 backdrop-blur border border-gray-300 hover:bg-blue-500/20'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white/30 backdrop-blur/30 backdrop-blur border border-gray-300 rounded-lg hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Successiva
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default NovitaArchivePage;


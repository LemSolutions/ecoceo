"use client";

import { safeFetch } from '@/sanity/lib/client';
import { postsQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPostId, setSelectedPostId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await safeFetch(postsQuery);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Normalizza una parola per il confronto (rimuove plurali e desinenze simili)
  const normalizeWord = (word: string) => {
    let normalized = word.toLowerCase();
    // Rimuovi desinenze plurali comuni
    if (normalized.endsWith('che')) normalized = normalized.slice(0, -3) + 'ca';
    if (normalized.endsWith('ci')) normalized = normalized.slice(0, -2) + 'co';
    if (normalized.endsWith('gi')) normalized = normalized.slice(0, -2) + 'go';
    if (normalized.endsWith('i') && normalized.length > 3) normalized = normalized.slice(0, -1);
    if (normalized.endsWith('e') && normalized.length > 3) normalized = normalized.slice(0, -1);
    return normalized;
  };

  // Extract a unique keyword for each post from its title
  const extractPostKeywords = () => {
    const stopWords = new Set(['il', 'la', 'lo', 'gli', 'le', 'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'e', 'o', 'ma', 'se', 'che', 'un', 'una', 'uno', 'dei', 'delle', 'degli', 'del', 'della', 'dello', 'dalle', 'dai', 'dal', 'dall', 'dalla', 'dallo', 'alle', 'ai', 'al', 'all', 'alla', 'allo', 'sulle', 'sui', 'sul', 'sull', 'sulla', 'sullo', 'per', 'perché', 'come', 'quando', 'dove', 'chi', 'cosa', 'quale', 'quali', 'questo', 'questa', 'questi', 'queste', 'quello', 'quella', 'quelli', 'quelle', 'più', 'meno', 'molto', 'molti', 'molte', 'tanto', 'tanti', 'tante', 'tutto', 'tutti', 'tutte', 'ogni', 'ognuno', 'ognuna', 'alcuni', 'alcune', 'alcuno', 'alcuna', 'nessun', 'nessuna', 'nessuno', 'nessune', 'qualche', 'qualcosa', 'qualcuno', 'qualcuna', 'altro', 'altri', 'altre', 'altra']);
    
    const usedNormalized = new Set<string>();
    const result: Array<{ postId: string; keyword: string; title: string }> = [];
    
    // Estrai tutte le parole candidate per ogni post
    const postsWithCandidates = posts.map(post => {
      const title = getTextValue(post.title).toLowerCase();
      const words = title.split(/\s+/).filter(word => {
        const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
        return cleanWord.length > 3 && !stopWords.has(cleanWord);
      });
      
      return {
        postId: post._id,
        title: getTextValue(post.title),
        candidates: words
      };
    });
    
    // Assegna parole chiave uniche
    postsWithCandidates.forEach(({ postId, title, candidates }) => {
      let keyword = null;
      
      // Prova ogni candidato finché non trovi uno unico
      for (const candidate of candidates) {
        const normalized = normalizeWord(candidate);
        const capitalized = candidate.charAt(0).toUpperCase() + candidate.slice(1);
        
        // Controlla se la parola normalizzata è già stata usata
        if (!usedNormalized.has(normalized)) {
          keyword = capitalized;
          usedNormalized.add(normalized);
          break;
        }
      }
      
      // Se non hai trovato una parola unica, prova combinazioni
      if (!keyword && candidates.length >= 2) {
        // Prova combinazione di due parole
        for (let i = 0; i < candidates.length - 1; i++) {
          const combo = candidates[i].charAt(0).toUpperCase() + candidates[i].slice(1) + 
                       candidates[i + 1].charAt(0).toUpperCase() + candidates[i + 1].slice(1);
          const normalized = normalizeWord(combo);
          if (!usedNormalized.has(normalized)) {
            keyword = combo;
            usedNormalized.add(normalized);
            break;
          }
        }
      }
      
      // Se ancora non hai trovato, usa un fallback con numero
      if (!keyword) {
        let counter = 1;
        const baseWord = candidates[0] ? 
          candidates[0].charAt(0).toUpperCase() + candidates[0].slice(1) : 
          'Articolo';
        let fallback = baseWord + counter;
        while (usedNormalized.has(normalizeWord(fallback))) {
          counter++;
          fallback = baseWord + counter;
        }
        keyword = fallback;
        usedNormalized.add(normalizeWord(fallback));
      }
      
      result.push({
        postId: postId,
        keyword: keyword,
        title: title
      });
    });
    
    return result;
  };

  const postKeywords = extractPostKeywords();

  // Helper per verificare se tutti i filtri sono vuoti (stato "Tutti")
  const isAllFiltersEmpty = selectedCategory === 'all' && !selectedPostId && !searchTerm;

  // Filter posts based on search, category, and selected post
  const filteredPosts = posts.filter(post => {
    const matchesSearch = getTextValue(post.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getTextValue(post.body?.[0]?.children?.[0]?.text || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.categories?.includes(selectedCategory);
    const matchesPost = !selectedPostId || post._id === selectedPostId;
    return matchesSearch && matchesCategory && matchesPost;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(posts.flatMap(post => post.categories || [])))];

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-gray-600">Caricamento articoli...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Nessun articolo disponibile</h3>
          <p className="text-gray-600 mb-8">Crea i tuoi primi articoli in Sanity Studio per iniziare.</p>
          <button 
            onClick={() => window.location.href = '/studio'}
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Vai a Sanity Studio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Search and Filter Section */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-2xl shadow-lg p-6 lg:p-8">
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
                placeholder="Cerca articoli..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPostId('');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isAllFiltersEmpty
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white/80 backdrop-blur-sm text-primary hover:bg-white/90 hover:shadow-sm border border-white/50'
              }`}
            >
              Tutti
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  if (category === 'all') {
                    // Se clicchi "Tutte le categorie", resetta tutti i filtri (stessa logica del bottone "Tutti")
                    setSelectedCategory('all');
                    setSelectedPostId('');
                    setSearchTerm('');
                    setCurrentPage(1);
                  } else {
                    // Se selezioni una categoria specifica, disattiva il filtro post ma mantieni la ricerca
                    setSelectedCategory(category);
                    setSelectedPostId('');
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === 'all' 
                    ? isAllFiltersEmpty
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white/80 backdrop-blur-sm text-primary hover:bg-white/90 hover:shadow-sm border border-white/50'
                    : selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Tutti' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Post Keyword Buttons - One button per blog post */}
        {postKeywords.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {postKeywords.map(({ postId, keyword }) => (
                <button
                  key={postId}
                  onClick={() => {
                    const newPostId = selectedPostId === postId ? '' : postId;
                    setSelectedPostId(newPostId);
                    // Se selezioni un post, reset della categoria a 'all' per mostrare tutti i post della categoria
                    if (newPostId) {
                      setSelectedCategory('all');
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedPostId === postId
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white/80 backdrop-blur-sm text-primary hover:bg-white/90 hover:shadow-sm border border-white/50'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            {filteredPosts.length === 1 
              ? '1 articolo trovato' 
              : `${filteredPosts.length} articoli trovati`
            }
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((post, index) => (
          <article
            key={post._id || index}
            className="group bg-white/30 backdrop-blur/30 backdrop-blurrounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Image */}
            <Link href={`/blog/${post.slug?.current || post._id}`}>
              <div className="relative aspect-[16/10] overflow-hidden">
                {post.mainImage ? (
                  <img
                    src={getImageUrl(post.mainImage)}
                    alt={getTextValue(post.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full r from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Category Badge */}
                {post.categories && post.categories.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {post.categories[0]}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Content */}
            <div className="p-6">
              {/* Meta */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Admin</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {post.publishedAt 
                      ? new Date(post.publishedAt).toLocaleDateString('it-IT', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Data non disponibile'
                    }
                  </span>
                </div>
              </div>

              {/* Title */}
              <Link href={`/blog/${post.slug?.current || post._id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {getTextValue(post.title)}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                {getTextValue(post.body?.[0]?.children?.[0]?.text)?.substring(0, 120) || 
                 'Nessun contenuto disponibile'}...
              </p>

              {/* Read More */}
              <Link 
                href={`/blog/${post.slug?.current || post._id}`}
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
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white/30 backdrop-blur/30 backdrop-blurborder border-gray-300 rounded-lg hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    : 'text-gray-500 bg-white/30 backdrop-blur/30 backdrop-blurborder border-gray-300 hover:bg-blue-500/20'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white/30 backdrop-blur/30 backdrop-blurborder border-gray-300 rounded-lg hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Successiva
            </button>
          </nav>
        </div>
      )}

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nessun risultato trovato</h3>
            <p className="text-gray-600 mb-6">
              Prova a modificare i filtri di ricerca o a cercare qualcos'altro.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedPostId('');
              }}
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filtri
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;

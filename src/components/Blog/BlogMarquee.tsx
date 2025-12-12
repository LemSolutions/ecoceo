"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { postsQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';

interface BlogMarqueeProps {
  speedMultiplier?: number;
}

const BlogMarquee = ({ speedMultiplier = 1 }: BlogMarqueeProps) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastXRef = useRef(0);
  const currentSpeedRef = useRef(18 / speedMultiplier);
  const animationFrameRef = useRef<number | null>(null);
  const hasMovedRef = useRef(false);
  
  // Velocità di base e moderata per il drag (moltiplicate per il moltiplicatore)
  const baseSpeed = 18 / speedMultiplier; // secondi - velocità normale
  const dragSpeed = 13 / speedMultiplier; // secondi - velocità moderata durante il drag

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await safeFetch(postsQuery);
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (error) {
        console.error('Error fetching posts data:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Aggiorna la velocità quando cambia il moltiplicatore
  useEffect(() => {
    const newBaseSpeed = 18 / speedMultiplier;
    currentSpeedRef.current = newBaseSpeed;
    if (wrapperRef.current && !isDraggingRef.current && !selectedPostId) {
      wrapperRef.current.style.animationDuration = `${newBaseSpeed}s`;
      wrapperRef.current.style.animationPlayState = 'running';
    }
  }, [speedMultiplier]);

  // Ferma/riprendi l'animazione quando un blog è selezionato
  useEffect(() => {
    if (wrapperRef.current) {
      if (selectedPostId) {
        wrapperRef.current.style.animationPlayState = 'paused';
      } else {
        wrapperRef.current.style.animationPlayState = 'running';
      }
    }
  }, [selectedPostId]);

  // Funzione per aggiornare la velocità dell'animazione
  const updateAnimationSpeed = (speed: number) => {
    if (wrapperRef.current) {
      wrapperRef.current.style.animationDuration = `${speed}s`;
      currentSpeedRef.current = speed;
    }
  };

  // Funzione di decelerazione graduale
  const decelerateToBaseSpeed = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const startSpeed = currentSpeedRef.current;
    const endSpeed = baseSpeed;
    const duration = 800; // ms - decelerazione più lunga per essere più fluida
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out: ease-out curve per decelerazione fluida
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentSpeed = startSpeed + (endSpeed - startSpeed) * easeOut;
      
      updateAnimationSpeed(currentSpeed);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Gestione fine drag
  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    
    // Se c'è stato movimento, decelera gradualmente
    if (hasMovedRef.current) {
      decelerateToBaseSpeed();
    }
    
    isDraggingRef.current = false;
    hasMovedRef.current = false;
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    
    // Se c'è stato movimento, decelera gradualmente
    if (hasMovedRef.current) {
      decelerateToBaseSpeed();
    }
    
    isDraggingRef.current = false;
    hasMovedRef.current = false;
  };

  // Listener globali per gestire il drag anche fuori dal container
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const currentX = e.clientX;
      const totalDeltaX = Math.abs(currentX - dragStartXRef.current);
      
      // Se c'è movimento significativo (> 5px), considera come drag
      if (totalDeltaX > 5) {
        hasMovedRef.current = true;
        // Applica velocità moderata quando si trascina
        updateAnimationSpeed(dragSpeed);
      }
      
      lastXRef.current = currentX;
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        handleMouseUp();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;
      
      const currentX = e.touches[0].clientX;
      const totalDeltaX = Math.abs(currentX - dragStartXRef.current);
      
      // Se c'è movimento significativo (> 5px), considera come drag
      if (totalDeltaX > 5) {
        hasMovedRef.current = true;
        // Applica velocità moderata quando si trascina
        updateAnimationSpeed(dragSpeed);
      }
      
      lastXRef.current = currentX;
    };

    const handleGlobalTouchEnd = () => {
      if (isDraggingRef.current) {
        handleTouchEnd();
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove);
    window.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Trasforma i post di Sanity in schede per il marquee
  const blogCards = posts.map((post) => ({
    id: post._id,
    title: getTextValue(post.title),
    link: `/blog/${post.slug?.current || post._id}`,
    image: post.mainImage ? (
      <img
        src={getImageUrl(post.mainImage)}
        alt={getTextValue(post.title)}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    ),
  }));

  // Se non ci sono post, mostra un messaggio o non renderizza nulla
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-white/80">Caricamento articoli...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  // Duplica le schede per creare un loop infinito fluido
  // Triplicare per garantire transizione senza salti
  const duplicatedCards = [...blogCards, ...blogCards, ...blogCards];

  // Gestione inizio drag
  const handleMouseDown = (e: React.MouseEvent) => {
    // Non iniziare il drag se si clicca su un link o sull'immagine (per selezione)
    if ((e.target as HTMLElement).closest('a') || 
        (e.target as HTMLElement).closest('.blog-image-container')) {
      return;
    }
    
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    lastXRef.current = e.clientX;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Non iniziare il drag se si tocca un link o sull'immagine (per selezione)
    if ((e.target as HTMLElement).closest('a') || 
        (e.target as HTMLElement).closest('.blog-image-container')) {
      return;
    }
    
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = e.touches[0].clientX;
    lastXRef.current = e.touches[0].clientX;
  };

  // Gestione movimento durante il drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const currentX = e.clientX;
    const deltaX = currentX - lastXRef.current;
    const totalDeltaX = Math.abs(currentX - dragStartXRef.current);
    
    // Se c'è movimento significativo (> 5px), considera come drag
    if (totalDeltaX > 5) {
      hasMovedRef.current = true;
      // Applica velocità moderata quando si trascina
      updateAnimationSpeed(dragSpeed);
    }
    
    lastXRef.current = currentX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length === 0) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - lastXRef.current;
    const totalDeltaX = Math.abs(currentX - dragStartXRef.current);
    
    // Se c'è movimento significativo (> 5px), considera come drag
    if (totalDeltaX > 5) {
      hasMovedRef.current = true;
      // Applica velocità moderata quando si trascina
      updateAnimationSpeed(dragSpeed);
    }
    
    lastXRef.current = currentX;
  };

  // Gestione mouse leave durante il drag
  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes buttonPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.5), 0 0 0 12px rgba(59, 130, 246, 0);
          }
        }

        @keyframes buttonGlow {
          0%, 100% {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.2));
            border-color: rgba(59, 130, 246, 0.6);
          }
          50% {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.3));
            border-color: rgba(59, 130, 246, 0.8);
          }
        }

        .animate-buttonPulse {
          animation: buttonPulse 1.8s ease-in-out infinite, buttonGlow 2.2s ease-in-out infinite;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.2)) !important;
          border: 2px solid rgba(59, 130, 246, 0.6) !important;
          color: rgba(37, 99, 235, 1) !important;
          font-weight: 600 !important;
        }

        .marquee-container {
          overflow-x: hidden;
          overflow-y: visible;
          width: 100%;
          position: relative;
          cursor: grab;
          user-select: none;
          padding: 40px 0;
          perspective: 1000px;
        }

        .marquee-container:active {
          cursor: grabbing;
        }

        .marquee-wrapper {
          display: flex;
          width: fit-content;
          animation: marquee-scroll 18s linear infinite;
          will-change: transform;
        }

        .blog-card {
          flex-shrink: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          transform-style: preserve-3d;
          transform: rotateY(-15deg) translateZ(-30px);
        }

        /* Variazione leggera per effetto più dinamico */
        .blog-card:nth-child(odd) {
          transform: rotateY(-12deg) translateZ(-25px);
        }

        .blog-card:nth-child(even) {
          transform: rotateY(-18deg) translateZ(-35px);
        }

        /* Quando selezionato */
        .blog-card.selected {
          transform: rotateY(0deg) translateY(-12px) scale(1.05) translateZ(50px);
          z-index: 20;
        }

        /* Hover su card non selezionate */
        .blog-card:hover:not(.selected) {
          transform: rotateY(0deg) scale(1.1) translateZ(50px);
          z-index: 10;
        }

        /* Hover su card selezionate */
        .blog-card:hover.selected {
          transform: rotateY(0deg) translateY(-12px) scale(1.05) translateZ(50px);
          z-index: 20;
        }

        .blog-card:hover article {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(59, 130, 246, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.4);
        }

        .blog-card article {
          height: 100%;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .blog-card:hover .blog-image-container img {
          transform: scale(1.05);
        }

        .blog-image-container img {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .blog-card article {
          height: 100%;
        }
      `}</style>

      <div 
        className="marquee-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="marquee-wrapper" ref={wrapperRef}>
          {duplicatedCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className={`blog-card w-[200px] md:w-[340px] lg:w-[420px] mx-4 ${
                selectedPostId === card.id ? 'selected' : ''
              }`}
            >
                <article className={`group bg-white/30 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col h-full ${
                selectedPostId === card.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
              } hover:bg-white/40`}>
                {/* Image - click per selezionare/deselezionare */}
                <div 
                  className="blog-image-container relative aspect-[16/10] overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedPostId === card.id) {
                      // Deseleziona se già selezionato
                      setSelectedPostId(null);
                    } else {
                      // Seleziona questo blog
                      setSelectedPostId(card.id);
                    }
                  }}
                >
                  {card.image}
                  {selectedPostId === card.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-blue-500/40 blur-xl animate-pulse"></div>
                      
                      {/* Badge principale */}
                      <div className="relative bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-md px-3 py-2 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-2xl border-2 border-blue-400/50 transform scale-100 animate-scaleIn">
                        <div className="flex items-center gap-2 md:gap-3">
                          {/* Icona check */}
                          <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          
                          {/* Testo */}
                          <div>
                            <p className="text-blue-600 font-bold text-sm md:text-lg">Selezionato</p>
                            <p className="text-blue-500/70 text-[10px] md:text-xs font-medium">Clicca per deselezionare</p>
                          </div>
                        </div>
                        
                        {/* Sparkle effects */}
                        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 w-2 h-2 md:w-3 md:h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Title and Button */}
                <div 
                  className="p-4 md:p-6 flex flex-col flex-grow gap-4 md:gap-8 cursor-pointer"
                  onClick={(e) => {
                    // Non selezionare se si clicca sul bottone
                    if ((e.target as HTMLElement).closest('a')) {
                      return;
                    }
                    e.stopPropagation();
                    if (selectedPostId === card.id) {
                      // Deseleziona se già selezionato
                      setSelectedPostId(null);
                    } else {
                      // Seleziona questo blog
                      setSelectedPostId(card.id);
                    }
                  }}
                >
                  <h3 
                    className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors"
                  >
                    {card.title}
                  </h3>
                  <Link
                    href={card.link}
                    className={`inline-flex items-center mt-auto px-4 py-2 md:px-6 md:py-3 bg-white/30 backdrop-blur-sm text-blue-600 font-semibold rounded-lg hover:bg-white/40 transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base ${
                      selectedPostId === card.id ? 'animate-buttonPulse' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Previeni la navigazione se c'è stato un drag
                      if (hasMovedRef.current) {
                        e.preventDefault();
                        hasMovedRef.current = false;
                      }
                    }}
                  >
                    Per saperne di più
                    <svg
                      className="w-5 h-5 ml-2"
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
                </div>
              </article>
            </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default BlogMarquee;


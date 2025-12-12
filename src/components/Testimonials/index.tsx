"use client";

import { safeFetch } from '@/sanity/lib/client';
import { testimonialsQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect, useRef, useCallback } from 'react';

const AUTO_SCROLL_INTERVAL = 5000; // 5 secondi
const TRANSITION_DURATION = 600; // Durata transizione fluida (600ms)
const TRANSITION_TIMING = 'ease-in-out'; // Funzione di temporizzazione rilassante

const SingleTestimonial = ({ testimonial, index, isActive = false, isSide = false, isLeft = false, isMobile = false }) => {
  const { getComponent } = useSanityUIComponents();
  const testimonialCardComponent = getComponent('TestimonialCard');
  const testimonialContentComponent = getComponent('TestimonialContent');
  const testimonialAuthorComponent = getComponent('TestimonialAuthor');

  return (
    <SanityStyledComponent
      component={testimonialCardComponent}
      componentName="TestimonialCard"
      className="w-full flex-shrink-0"
    >
      <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
        <div className={`group/tes relative rounded-sm bg-white/30 backdrop-blur/30 backdrop-blurp-8 shadow-testimonial dark:bg-dark p-4 md:lg:px-12 md:xl:p-14 transition-all duration-300 ${
          isActive 
            ? 'opacity-100 scale-100' 
            : isLeft && !isMobile
            ? 'opacity-60 scale-90 blur-sm' 
            : isLeft && isMobile
            ? 'opacity-90 scale-95' 
            : isSide 
            ? 'opacity-60 scale-90 blur-sm' 
            : 'opacity-0 scale-75'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative h-12 w-12 md:h-16 md:w-16 overflow-hidden rounded-full flex-shrink-0">
                {testimonial.image ? (
                  <img
                    src={getImageUrl(testimonial.image)}
                    alt={getTextValue(testimonial.name)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs md:text-sm">{getTextValue(testimonial.name)?.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <SanityStyledComponent
                  component={testimonialAuthorComponent}
                  componentName="TestimonialAuthor"
                  as="h3"
                  className="text-base md:text-xl font-semibold text-dark dark:text-white break-words"
                >
                  {getTextValue(testimonial.name)}
                </SanityStyledComponent>
                <p className="text-xs md:text-sm text-body-color truncate">{getTextValue(testimonial.designation)}</p>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500 text-sm md:text-base">
                  {i < (testimonial.star || 5) ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>
          <SanityStyledComponent
            component={testimonialContentComponent}
            componentName="TestimonialContent"
            as="p"
            className="mt-4 md:mt-8 text-sm md:text-base leading-tight md:leading-relaxed text-body-color dark:text-body-color-dark testimonial-text-mobile"
          >
            "{getTextValue(testimonial.content)}"
          </SanityStyledComponent>
        </div>
      </div>
    </SanityStyledComponent>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0); // Posizione nel container esteso
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsData = await safeFetch(testimonialsQuery);
        const testimonialsArray = Array.isArray(testimonialsData) ? testimonialsData : [];
        setTestimonials(testimonialsArray);
        // Inizia dalla posizione che corrisponde all'indice 0 nell'array originale
        if (testimonialsArray.length > 0) {
          setCurrentPosition(testimonialsArray.length); // Inizia dalla prima copia (dopo la duplicazione iniziale)
        }
      } catch (error) {
        console.error('Error fetching testimonials data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Crea array esteso per loop infinito fluido: [ultima, ...tutte, ...tutte, ...tutte, prima]
  // Più duplicazioni = più spazio per movimento continuo senza mai raggiungere la fine visibile
  // Come un cane che si morde la coda - movimento infinito e passionale
  const createExtendedArray = () => {
    if (testimonials.length === 0) return [];
    return [
      ...testimonials.slice(-1), // Ultima all'inizio per il loop
      ...testimonials, // Prima copia completa
      ...testimonials, // Seconda copia completa
      ...testimonials, // Terza copia completa (più spazio per movimento continuo)
      ...testimonials.slice(0, 1), // Prima alla fine per il loop
    ];
  };

  const extendedTestimonials = createExtendedArray();

  // Calcola translateX: su mobile ogni recensione occupa 100% della larghezza, su desktop 33.333%
  const getTranslateX = () => {
    if (extendedTestimonials.length === 0) return 0;
    if (isMobile) {
      return -(currentPosition - 1) * 100;
    } else {
      return -(currentPosition - 1) * (100 / 3);
    }
  };

  // Funzione per determinare se una recensione è attiva o laterale
  const getTestimonialState = (index: number) => {
    const centerIndex = currentPosition;
    if (index === centerIndex) {
      return { isActive: true, isSide: false, isLeft: false };
    } else if (index === centerIndex - 1) {
      return { isActive: false, isSide: true, isLeft: true };
    } else if (index === centerIndex + 1) {
      return { isActive: false, isSide: true, isLeft: false };
    }
    return { isActive: false, isSide: false, isLeft: false };
  };

  // Funzione per andare alla recensione successiva con movimento continuo infinito
  // Come un cane che si morde la coda - movimento fluido e passionale senza mai fermarsi
  // Nessun reset visibile - movimento completamente continuo senza scatti
  const goToNext = useCallback(() => {
    if (testimonials.length === 0 || isTransitioning) return;
    
    setIsTransitioning(true);
    let newPosition = currentPosition + 1;
    
    // Zona sicura MOLTO ampia - reset PRIMA dell'animazione quando siamo ancora molto lontani dalla fine
    // Questo garantisce che il reset sia completamente invisibile (40% dell'array = reset molto anticipato)
    const safeZone = Math.max(10, Math.floor(extendedTestimonials.length * 0.4)); // Almeno 10 o 40% dell'array
    const resetThreshold = extendedTestimonials.length - safeZone;
    
    // Se siamo nella zona di reset, resettiamo PRIMA di animare
    if (currentPosition >= resetThreshold) {
      // Calcola quale recensione stiamo vedendo ora (prima del movimento)
      const currentRealIndex = ((currentPosition - 1) % testimonials.length + testimonials.length) % testimonials.length;
      // Reset alla posizione equivalente nella seconda copia (zona sicura centrale)
      const resetPosition = testimonials.length + 1 + currentRealIndex;
      
      // Reset invisibile PRIMA dell'animazione - triplo requestAnimationFrame per sincronizzazione perfetta
      if (carouselTrackRef.current) {
        carouselTrackRef.current.style.transition = 'none';
        const resetTranslateX = isMobile 
          ? -(resetPosition - 1) * 100 
          : -(resetPosition - 1) * (100 / 3);
        carouselTrackRef.current.style.transform = `translateX(${resetTranslateX}%)`;
        void carouselTrackRef.current.offsetHeight;
        
        // Triplo requestAnimationFrame per garantire che il reset sia completamente applicato
        // prima di riabilitare la transizione e animare
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setCurrentPosition(resetPosition);
              newPosition = resetPosition + 1; // Nuova posizione dopo il reset
              
              // Riabilita la transizione nel prossimo frame
              requestAnimationFrame(() => {
                if (carouselTrackRef.current) {
                  carouselTrackRef.current.style.transition = `transform ${TRANSITION_DURATION}ms ${TRANSITION_TIMING}`;
                }
                // Ora anima alla nuova posizione
                setCurrentPosition(newPosition);
                setTimeout(() => {
                  setIsTransitioning(false);
                }, TRANSITION_DURATION);
              });
            });
          });
        });
      } else {
        setIsTransitioning(false);
      }
    } else {
      // Movimento normale - continuo e fluido senza interruzioni
      setCurrentPosition(newPosition);
    setTimeout(() => {
        setIsTransitioning(false);
    }, TRANSITION_DURATION);
    }
  }, [testimonials.length, isTransitioning, currentPosition, extendedTestimonials.length, isMobile]);

  // Funzione per andare alla recensione precedente con movimento continuo infinito
  // Come un cane che si morde la coda - movimento fluido e passionale senza mai fermarsi
  // Nessun reset visibile - movimento completamente continuo senza scatti
  const goToPrevious = useCallback(() => {
    if (testimonials.length === 0 || isTransitioning) return;
    
    setIsTransitioning(true);
    let newPosition = currentPosition - 1;
    
    // Zona sicura MOLTO ampia - reset PRIMA dell'animazione quando siamo ancora molto lontani dall'inizio
    // Questo garantisce che il reset sia completamente invisibile (40% dell'array = reset molto anticipato)
    const safeZone = Math.max(10, Math.floor(extendedTestimonials.length * 0.4)); // Almeno 10 o 40% dell'array
    const resetThreshold = safeZone;
    
    // Se siamo nella zona di reset, resettiamo PRIMA di animare
    if (currentPosition <= resetThreshold) {
      // Calcola quale recensione stiamo vedendo ora (prima del movimento)
      const currentRealIndex = ((currentPosition - 1) % testimonials.length + testimonials.length) % testimonials.length;
      // Reset alla posizione equivalente nella seconda copia (zona sicura centrale)
      // L'array esteso ha struttura: [ultima, ...copie..., prima]
      // La seconda copia inizia a: 1 (prima copia) + testimonials.length (seconda copia)
      const resetPosition = testimonials.length + 1 + currentRealIndex;
      
      // Reset invisibile PRIMA dell'animazione - approccio semplificato e più affidabile
      if (carouselTrackRef.current) {
        // Disabilita la transizione per il reset
        carouselTrackRef.current.style.transition = 'none';
        
        // Calcola la posizione di reset e quella finale
        const resetTranslateX = isMobile 
          ? -(resetPosition - 1) * 100 
          : -(resetPosition - 1) * (100 / 3);
        const finalPosition = resetPosition - 1;
        
        // Applica il reset immediatamente
        carouselTrackRef.current.style.transform = `translateX(${resetTranslateX}%)`;
        
        // Forza il reflow per applicare il reset
        void carouselTrackRef.current.offsetHeight;
        
        // Aggiorna lo stato alla posizione di reset per sincronizzare React
        setCurrentPosition(resetPosition);
        
        // Riabilita la transizione e anima alla nuova posizione dopo che il reset è stato applicato
        // Usa doppio requestAnimationFrame per garantire che il reset sia completamente applicato
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (carouselTrackRef.current) {
                  carouselTrackRef.current.style.transition = `transform ${TRANSITION_DURATION}ms ${TRANSITION_TIMING}`;
              
              // Aggiorna lo stato alla posizione finale per avviare la transizione
              setCurrentPosition(finalPosition);
              
                setTimeout(() => {
                  setIsTransitioning(false);
                }, TRANSITION_DURATION);
            }
          });
        });
      } else {
        setIsTransitioning(false);
      }
    } else {
      // Movimento normale - continuo e fluido senza interruzioni
      setCurrentPosition(newPosition);
    setTimeout(() => {
        setIsTransitioning(false);
    }, TRANSITION_DURATION);
    }
  }, [testimonials.length, isTransitioning, currentPosition, extendedTestimonials.length, isMobile]);

  // Auto-scroll logic con pausa su hover
  useEffect(() => {
    if (testimonials.length === 0 || isPaused || isTransitioning) {
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
      return;
    }

    autoScrollTimerRef.current = setTimeout(() => {
      goToNext();
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
      }
    };
  }, [currentPosition, testimonials.length, isPaused, isTransitioning, goToNext]);

  // Gestione hover per pausa/ripresa
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Get UI components for Testimonials section
  const testimonialsSectionComponent = getComponent('TestimonialsSection');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento testimonials...</p>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Testimonials Section</h3>
        <p className="text-gray-600 mb-6">Create your testimonials in Sanity Studio to get started.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Go to Sanity Studio
        </button>
      </div>
    );
  }

  // Calcola l'indice reale nell'array originale per gli indicatori
  const getRealIndex = () => {
    if (currentPosition <= testimonials.length) {
      return (currentPosition - 1 + testimonials.length) % testimonials.length;
    }
    return (currentPosition - testimonials.length - 1) % testimonials.length;
  };

  const realIndex = getRealIndex();
  const translateX = getTranslateX();

  return (
    <div 
      className="relative overflow-hidden py-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Stili CSS globali per ottimizzare le animazioni */}
      <style jsx global>{`
        .carousel-track {
          transition: transform ${TRANSITION_DURATION}ms ${TRANSITION_TIMING};
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .testimonial-text-mobile {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
        }
        @media (min-width: 768px) {
          .testimonial-text-mobile {
            display: block;
            -webkit-line-clamp: unset;
            -webkit-box-orient: unset;
            overflow: visible;
            line-height: 1.6;
          }
        }
      `}</style>

      {/* Frecce di navigazione */}
      <button
        onClick={goToPrevious}
        disabled={isTransitioning}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Recensione precedente"
      >
        <svg 
          className="w-5 h-5 md:w-6 md:h-6 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        disabled={isTransitioning}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Recensione successiva"
      >
        <svg 
          className="w-5 h-5 md:w-6 md:h-6 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Container del carosello */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center overflow-hidden min-h-[250px] md:min-h-[400px]">
          {/* Container principale con overflow nascosto per mostrare solo 3 schede */}
          <div className="relative w-full overflow-hidden">
            {/* Carousel track - contiene TUTTE le recensioni e si muove continuamente */}
            <div 
              ref={carouselTrackRef}
              className="carousel-track flex items-center"
              style={{
                transform: `translateX(${translateX}%)`,
              }}
            >
              {/* Renderizza TUTTE le recensioni dell'array esteso - movimento continuo */}
              {extendedTestimonials.map((testimonial, index) => {
                const { isActive, isSide, isLeft } = getTestimonialState(index);
                return (
                  <div 
                    key={`extended-${index}`}
                    className={`flex-shrink-0 ${
                      isMobile 
                        ? 'w-full px-2'
                        : 'w-[33.333%] px-2 md:px-4 lg:px-6'
                    }`}
                  >
                    <SingleTestimonial 
                      testimonial={testimonial} 
                      index={index}
                      isActive={isActive}
                      isSide={isSide}
                      isLeft={isLeft}
                      isMobile={isMobile}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Indicatori di posizione */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning && index !== realIndex) {
                const diff = index - realIndex;
                const forwardDistance = diff >= 0 ? diff : diff + testimonials.length;
                const backwardDistance = diff <= 0 ? -diff : testimonials.length - diff;
                
                if (forwardDistance <= backwardDistance) {
                  // Vai avanti
                  for (let i = 0; i < forwardDistance; i++) {
                    setTimeout(() => goToNext(), i * 50);
                  }
                } else {
                  // Vai indietro
                  for (let i = 0; i < backwardDistance; i++) {
                    setTimeout(() => goToPrevious(), i * 50);
                  }
                }
              }
            }}
            disabled={isTransitioning}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === realIndex 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={`Vai alla recensione ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;

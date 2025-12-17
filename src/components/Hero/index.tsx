"use client";

import Image from "next/image";
import { safeFetch } from '@/sanity/lib/client';
import { heroQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import SanityLink from '@/components/Common/SanityLink';
import { useState, useEffect, useRef, type CSSProperties } from 'react';

// Componente per il video di sfondo YouTube con blur e controllo Intersection Observer
const HeroVideoBackground = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  
  const VIDEO_ID = 'eeMQwUy38Ow'; // Video di sfondo: https://youtu.be/eeMQwUy38Ow
  // URL YouTube embed con autoplay, mute, loop e parametri ottimizzati per nascondere tutti i controlli
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&start=0&disablekb=1&fs=0&iv_load_policy=3&showinfo=0&cc_load_policy=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;

  useEffect(() => {
    // Carica il video dopo un breve delay per dare priorità al contenuto iniziale
    const loadTimer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 800); // Delay di 800ms per migliorare LCP

    // Trova la sezione Hero usando l'ID
    const heroSection = document.getElementById('home');
    if (!heroSection) {
      clearTimeout(loadTimer);
      return;
    }

    heroSectionRef.current = heroSection;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const ratio = entry.intersectionRatio;

        // Carica il video quando la sezione diventa visibile
        if (ratio > 0 && !shouldLoadVideo) {
          setShouldLoadVideo(true);
        }

        // Fade progress: scompare subito appena si esce dalla Hero
        const fadeStart = 0.98; // inizio dissolvenza con minimo movimento
        const fadeEnd = 0.6;   // opacità zero poco dopo
        const clamped =
          ratio >= fadeStart
            ? 1
            : ratio <= fadeEnd
              ? 0
              : (ratio - fadeEnd) / (fadeStart - fadeEnd);

        // Ease-out per una dissolvenza più morbida e lenta
        const eased = Math.pow(clamped, 1.5);
        setFadeOpacity(eased);
        setIsVisible(ratio > 0.05);
      },
      { 
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0], // Threshold ottimizzato (meno calcoli)
        rootMargin: '0px'
      }
    );

    observer.observe(heroSection);

    return () => {
      clearTimeout(loadTimer);
      observer.disconnect();
    };
  }, [shouldLoadVideo]);

  return (
    <div
      ref={videoContainerRef}
      className="player-controls-background absolute inset-0 z-0 overflow-hidden hidden lg:block"
      style={{
        opacity: isVisible ? fadeOpacity : 0,
        transition: 'opacity 1.6s cubic-bezier(0.22, 0.61, 0.36, 1)',
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
    >
      {/* Container del video senza blur */}
      <div 
        className="absolute inset-0 w-full h-full"
      >
        {shouldLoadVideo ? (
          <iframe
            src={youtubeEmbedUrl}
            title="Hero Background Video"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
            style={{
              border: 'none',
              pointerEvents: 'none',
            }}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black/30" />
        )}
        {/* CSS per nascondere completamente i controlli YouTube */}
        <style jsx>{`
          .player-controls-background iframe {
            pointer-events: none !important;
          }
          .player-controls-background :global(.ytp-chrome-top),
          .player-controls-background :global(.ytp-chrome-bottom),
          .player-controls-background :global(.ytp-chrome-controls),
          .player-controls-background :global(.ytp-show-cards-title),
          .player-controls-background :global(.ytp-watermark),
          .player-controls-background :global(.ytp-title),
          .player-controls-background :global(.ytp-pause-overlay),
          .player-controls-background :global(.ytp-suggested-action),
          .player-controls-background :global(.ytp-ce-element),
          .player-controls-background :global(.ytp-impression-link),
          .player-controls-background :global(.ytp-impression-link-content),
          .player-controls-background :global(.ytp-impression-link-logo),
          .player-controls-background :global(.ytp-impression-link-text),
          .player-controls-background :global(.ytp-impression-link-text-link),
          .player-controls-background :global(.ytp-impression-link-text-link:hover),
          .player-controls-background :global(.ytp-impression-link-text-link:visited),
          .player-controls-background :global(.ytp-impression-link-text-link:active),
          .player-controls-background :global(.ytp-impression-link-text-link:focus),
          .player-controls-background :global(.ytp-impression-link-text-link:link),
          .player-controls-background :global(.ytp-impression-link-text-link:visited),
          .player-controls-background :global(.ytp-impression-link-text-link:hover),
          .player-controls-background :global(.ytp-impression-link-text-link:active),
          .player-controls-background :global(.ytp-impression-link-text-link:focus),
          .player-controls-background :global(.ytp-impression-link-text-link:link) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `}</style>
      </div>
      {/* Overlay scuro per migliorare la leggibilità del testo */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />
    </div>
  );
};

// Componente per il video mobile con animazione su e giù
const HeroVideoMobile = () => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const VIDEO_ID = 'eeMQwUy38Ow';
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&start=0&disablekb=1&fs=0&iv_load_policy=3&showinfo=0&cc_load_policy=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;

  useEffect(() => {
    // Carica il video mobile dopo un breve delay o quando entra in viewport
    const loadTimer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 1000);

    return () => clearTimeout(loadTimer);
  }, []);

  return (
    <div className="lg:hidden w-full max-w-2xl mx-auto mt-16 rounded-lg overflow-hidden shadow-lg video-float-mobile">
      <div 
        className="relative w-full aspect-video bg-black/20"
      >
        {shouldLoadVideo ? (
          <iframe
            src={youtubeEmbedUrl}
            title="Hero Video Mobile"
            className="absolute inset-0 w-full h-full rounded-lg"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
            style={{
              border: 'none',
            }}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-white text-sm">Caricamento video...</div>
          </div>
        )}
        <style jsx>{`
          .video-float-mobile {
            animation: videoFloatMobile 6s ease-in-out infinite;
            will-change: transform;
          }
          
          @keyframes videoFloatMobile {
            0% {
              transform: translateY(0px);
            }
            12.5% {
              transform: translateY(-40px);
            }
            25% {
              transform: translateY(-50px);
            }
            37.5% {
              transform: translateY(-40px);
            }
            50% {
              transform: translateY(0px);
            }
            62.5% {
              transform: translateY(40px);
            }
            75% {
              transform: translateY(50px);
            }
            87.5% {
              transform: translateY(40px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

const HERO_FLOAT_ANIMATION = `
  @keyframes heroFloat {
    0% { transform: translateY(0px) scale(1); box-shadow: 0 25px 60px -25px rgba(255, 120, 0, 0.45); }
    50% { transform: translateY(-18px) scale(1.025); box-shadow: 0 45px 90px -25px rgba(255, 210, 120, 0.7); }
    100% { transform: translateY(0px) scale(1); box-shadow: 0 25px 60px -25px rgba(255, 120, 0, 0.45); }
  }

  @keyframes heroShimmer {
    0% { transform: translateX(-60%) skewX(-15deg); opacity: 0; }
    35% { opacity: 0.65; }
    100% { transform: translateX(160%) skewX(-15deg); opacity: 0; }
  }

  .hero-video-wrapper::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 36px;
    background: linear-gradient(135deg, rgba(255, 136, 0, 0.5), rgba(255, 255, 255, 0.35));
    filter: blur(14px);
    opacity: 0.75;
    z-index: 0;
  }

  .hero-video-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.25), transparent 60%);
    mix-blend-mode: screen;
    opacity: 0.4;
    z-index: 1;
    animation: heroShimmer 6s linear infinite;
  }
`;

const heroTitleGlowStyle: CSSProperties = {
  backgroundImage: 'linear-gradient(120deg, #ff7b00 0%, #ffd966 45%, #fff6d9 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 15px 55px rgba(255, 140, 0, 0.65)',
  filter: 'drop-shadow(0 0 25px rgba(255, 173, 90, 0.4))',
};

const heroDescriptionGlowStyle: CSSProperties = {
  color: '#1f2937',
  textShadow: '0 10px 35px rgba(255, 173, 90, 0.45)',
};

const Hero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const heroData = await safeFetch(heroQuery);
        setHero(heroData);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setHero(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  // Get UI components for Hero section
  const heroSectionComponent = getComponent('HeroSection');
  const heroTitleComponent = getComponent('HeroTitle');
  const heroDescriptionComponent = getComponent('HeroDescription');
  const primaryButtonComponent = getComponent('PrimaryButton');
  const secondaryButtonComponent = getComponent('SecondaryButton');

  if (loading) {
    return (
      <section className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]">
        <div className="container">
          <div className="text-center">
            <p>Caricamento Hero...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <SanityStyledComponent
        component={heroSectionComponent}
        componentName="HeroSection"
        as="section"
        id="home"
        className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px] min-h-screen flex items-center"
        style={hero?.backgroundImage ? {
          backgroundImage: `url(${getImageUrl(hero.backgroundImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        {/* Video di sfondo YouTube con blur e controllo Intersection Observer - Solo desktop */}
        <HeroVideoBackground />
        
        {/* Contenuto principale della Hero con z-index più alto per essere sopra il video */}
        <div className="container relative z-[2]">
          <div className="-mx-4 flex flex-wrap items-center">
            {/* Left Column - Text Content */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="wow fadeInUp" data-wow-delay=".2s">
                {!hero ? (
                  <>
                    <SanityStyledComponent
                      component={heroTitleComponent}
                      componentName="HeroTitle"
                      as="h1"
                      className="relative inline-block mb-6 text-3xl font-bold leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight xl:text-7xl xl:leading-tight transition-transform duration-500 hover:-translate-y-1 hover:scale-[1.01]"
                      style={heroTitleGlowStyle}
                    >
                      Welcome to Our Platform
                    </SanityStyledComponent>
                    
                    <SanityStyledComponent
                      component={heroDescriptionComponent}
                      componentName="HeroDescription"
                      as="p"
                      className="relative inline-block mb-12 text-base leading-relaxed text-black/80 sm:text-lg md:text-xl lg:text-2xl"
                      style={heroDescriptionGlowStyle}
                    >
                      Create your hero section content in Sanity Studio to get started. Add compelling text and images to engage your visitors.
                    </SanityStyledComponent>
                    
                    <div className="flex flex-col items-start justify-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                      <SanityStyledComponent
                        component={primaryButtonComponent}
                        componentName="PrimaryButton"
                        as="div"
                        className="rounded-xs bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:opacity-80 cursor-pointer"
                        onClick={() => window.location.href = '/studio'}
                      >
                        Go to Sanity Studio
                      </SanityStyledComponent>
                    </div>
                    {/* Video mobile sotto il bottone */}
                    <HeroVideoMobile />
                  </>
                ) : (
                  <>
                    <SanityStyledComponent
                      component={heroTitleComponent}
                      componentName="HeroTitle"
                      as="h1"
                      className="mb-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight md:text-white lg:text-6xl lg:leading-tight xl:text-7xl xl:leading-tight relative px-4 py-3 rounded-lg md:backdrop-blur md:bg-white/15"
                    >
                      {getTextValue(hero.title)}
                    </SanityStyledComponent>
                    
                    <SanityStyledComponent
                      component={heroDescriptionComponent}
                      componentName="HeroDescription"
                      as="p"
                      className="mb-12 text-base leading-relaxed text-gray-800 sm:text-lg md:text-xl md:text-white lg:text-2xl relative px-4 py-3 rounded-lg md:backdrop-blur md:bg-white/15"
                    >
                      {getTextValue(hero.paragraph)}
                    </SanityStyledComponent>
                    
                    <div className="flex flex-col items-start justify-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                      {hero.primaryButton && (
                        <SanityStyledComponent
                          component={primaryButtonComponent}
                          componentName="PrimaryButton"
                          as="div"
                          className="hero-button-flash rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out cursor-pointer shadow-lg"
                          onClick={() => {
                            const url = getTextValue(hero.primaryButton.url);
                            const buttonText = getTextValue(hero.primaryButton.text).toLowerCase();
                            if (url.includes('preventivo') || buttonText.includes('preventivo')) {
                              window.location.href = 'mailto:commerciale@lemsolutions.it?subject=QUOTE LEM SOLUTIONS CERAMIC SYSTEMS';
                            } else {
                              window.location.href = url;
                            }
                          }}
                        >
                          {getTextValue(hero.primaryButton.text)}
                        </SanityStyledComponent>
                      )}
                      {hero.secondaryButton && (
                        <SanityStyledComponent
                          component={secondaryButtonComponent}
                          componentName="SecondaryButton"
                          as="div"
                          className="inline-block rounded-xs border border-primary px-8 py-4 text-base font-semibold text-primary duration-300 ease-in-out hover:bg-primary hover:text-white cursor-pointer"
                          onClick={() => window.location.href = getTextValue(hero.secondaryButton.url)}
                        >
                          {getTextValue(hero.secondaryButton.text)}
                        </SanityStyledComponent>
                      )}
                    </div>
                    {/* Video mobile sotto i bottoni */}
                    <HeroVideoMobile />
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Vuota per mantenere il layout compatto */}
            <div className="w-full px-4 lg:w-1/2">
            </div>
          </div>
        </div>
      </SanityStyledComponent>
      <style jsx>{HERO_FLOAT_ANIMATION}</style>
    </>
  );
};

export default Hero;

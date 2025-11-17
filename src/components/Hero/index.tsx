"use client";

import Image from "next/image";
import { safeFetch } from '@/sanity/lib/client';
import { heroQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import SanityLink from '@/components/Common/SanityLink';
import { useState, useEffect, type CSSProperties } from 'react';

const DEFAULT_HERO_VIDEO_URL = 'https://www.youtube.com/watch?v=5Rpkhvj0eWY';

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
  const extractYoutubeId = (url?: string | null) => {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.replace('www.', '');
      if (hostname.includes('youtu.be')) {
        return parsedUrl.pathname.replace('/', '');
      }
      if (hostname.includes('youtube.com')) {
        if (parsedUrl.pathname.startsWith('/embed/')) {
          return parsedUrl.pathname.split('/').pop();
        }
        if (parsedUrl.pathname.startsWith('/shorts/')) {
          return parsedUrl.pathname.split('/').pop();
        }
        return parsedUrl.searchParams.get('v');
      }
      return null;
    } catch (error) {
      console.warn('Invalid YouTube URL provided for hero video:', error);
      return null;
    }
  };

  const getYoutubeEmbedUrl = (videoUrl?: string | null) => {
    const videoId = extractYoutubeId(videoUrl);
    if (!videoId) return null;
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: videoId,
      controls: '0',
      modestbranding: '1',
      rel: '0',
      playsinline: '1',
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

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

  const youtubeEmbedUrl = getYoutubeEmbedUrl(hero?.videoUrl || DEFAULT_HERO_VIDEO_URL);

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
        <div className="container">
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
                  </>
                ) : (
                  <>
                    <SanityStyledComponent
                      component={heroTitleComponent}
                      componentName="HeroTitle"
                      as="h1"
                      className="mb-5 text-3xl font-bold leading-tight text-black sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight xl:text-7xl xl:leading-tight"
                    >
                      {getTextValue(hero.title)}
                    </SanityStyledComponent>
                    
                    <SanityStyledComponent
                      component={heroDescriptionComponent}
                      componentName="HeroDescription"
                      as="p"
                      className="mb-12 text-base leading-relaxed text-black/80 sm:text-lg md:text-xl lg:text-2xl"
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
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Media */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="wow fadeInUp" data-wow-delay=".4s">
                {youtubeEmbedUrl ? (
                  <div
                    className="hero-video-wrapper relative w-full max-w-[780px] lg:max-w-[800px] xl:max-w-[820px] lg:ml-auto overflow-hidden rounded-[32px] aspect-[16/9] lg:aspect-[18/9] bg-black/70"
                    style={{ animation: 'heroFloat 11s ease-in-out infinite' }}
                  >
                    <iframe
                      src={youtubeEmbedUrl ?? undefined}
                      title="Video presentazione LEM Solutions"
                      className="absolute inset-0 h-full w-full z-[2]"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-tr from-orange-500/25 via-transparent to-white/20 mix-blend-screen animate-pulse" />
                  </div>
                ) : (
                  <div
                    className="hero-video-wrapper relative w-full max-w-[780px] lg:max-w-[800px] xl:max-w-[820px] lg:ml-auto rounded-[32px]"
                    style={{ animation: 'heroFloat 11s ease-in-out infinite' }}
                  >
                    {hero?.heroImage ? (
                      <Image
                        src={getImageUrl(hero.heroImage)}
                        alt="Hero Image"
                        width={900}
                        height={560}
                        className="relative z-[2] mx-auto w-full lg:mr-0 rounded-[32px]"
                      />
                    ) : (
                      <div className="relative z-[2] w-full aspect-[16/9] lg:aspect-[18/9] bg-gradient-to-br from-primary/20 to-primary/40 rounded-[32px] flex items-center justify-center text-xl font-semibold text-primary">
                        Hero Media
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SanityStyledComponent>
      <style jsx>{HERO_FLOAT_ANIMATION}</style>
    </>
  );
};

export default Hero;

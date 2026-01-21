"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { safeFetch } from '@/sanity/lib/client';
import { novitaQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';

const AUTO_INTERVAL = 3000;

const NovitaCarousel = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const cardsPerView = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await safeFetch(novitaQuery);
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching novità', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const visibleItems = useMemo(() => items.slice(0, 8), [items]);
  const cardWidthPercent = 100;
  const trackWidthPercent = visibleItems.length * cardWidthPercent || 100;

  const goToIndex = useCallback(
    (nextIndex: number, animated = true) => {
      if (!visibleItems.length) return;
      if (animated) {
        setTransitionEnabled(true);
        setCurrent(nextIndex);
      } else {
        setTransitionEnabled(false);
        setCurrent(nextIndex);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setTransitionEnabled(true));
        });
      }
    },
    [visibleItems.length],
  );

  const goToNext = useCallback(() => {
    if (!visibleItems.length) return;
    const maxIndex = Math.max(visibleItems.length - cardsPerView, 0);
    if (current >= maxIndex) {
      goToIndex(0, true);
    } else {
      goToIndex(current + 1, true);
    }
  }, [visibleItems.length, cardsPerView, current, goToIndex]);

  const goToPrev = useCallback(() => {
    if (!visibleItems.length) return;
    const maxIndex = Math.max(visibleItems.length - cardsPerView, 0);
    if (current === 0) {
      goToIndex(maxIndex, true);
    } else {
      goToIndex(current - 1, true);
    }
  }, [visibleItems.length, cardsPerView, current, goToIndex]);

  useEffect(() => {
    if (!autoPlay || visibleItems.length <= 1) return;

    const maxIndex = Math.max(visibleItems.length - cardsPerView, 0);
    const timer = setTimeout(() => {
      if (current >= maxIndex) {
        goToIndex(0, false);
      } else {
        goToIndex(current + 1, true);
      }
    }, AUTO_INTERVAL);

    return () => clearTimeout(timer);
  }, [autoPlay, current, visibleItems.length, cardsPerView, goToIndex]);

  if (loading) {
    return (
      <article className="relative grid gap-0 rounded-[32px] overflow-hidden bg-white/5 border border-white/10 shadow-[0_35px_100px_-40px_rgba(0,0,0,0.9)] lg:grid-cols-[60%_40%] animate-pulse">
        <div className="relative h-[200px] sm:h-[240px] lg:h-full lg:min-h-[480px] bg-white/10" />
        <div className="p-4 md:p-6 lg:p-10 space-y-6">
          <div className="h-4 w-24 bg-white/20 rounded-full" />
          <div className="space-y-3">
            <div className="h-10 bg-white/20 rounded-lg" />
            <div className="h-10 bg-white/10 rounded-lg w-3/4" />
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-4 bg-white/10 rounded-full" />
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="h-12 w-40 bg-white/20 rounded-full" />
            <div className="h-12 w-32 bg-white/10 rounded-full" />
          </div>
        </div>
      </article>
    );
  }

  if (!visibleItems.length) {
    return null;
  }

  return (
    <article
      className="relative grid gap-0 rounded-[32px] overflow-hidden bg-white/5 border border-white/10 shadow-[0_35px_100px_-40px_rgba(0,0,0,0.9)] lg:grid-cols-[60%_40%]"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className="relative h-[200px] sm:h-[240px] lg:h-full lg:min-h-[480px] bg-black/40 flex items-center justify-center group">
        {visibleItems[current]?.mainImage ? (
          <Image
            src={getImageUrl(visibleItems[current].mainImage)}
            alt={getTextValue(visibleItems[current].title)}
            fill
            className="object-cover transition-all duration-500 ease-out group-hover:scale-95 group-hover:object-contain"
            sizes="(min-width: 1280px) 60vw, (min-width: 768px) 70vw, 100vw"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-lg font-semibold">
            Novità LEM
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-3 md:top-6 left-3 md:left-6 inline-flex items-center rounded-full bg-white/95 px-2 md:px-4 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] text-orange-600 shadow-lg shadow-black/20">
          {new Date(visibleItems[current]?._createdAt || Date.now()).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-10 flex flex-col h-full">
        <div className="space-y-3 md:space-y-4 lg:space-y-6">
          <div className="flex items-center text-xs uppercase tracking-[0.3em] text-white/60 gap-2">
            <span className="h-px flex-1 bg-white/20" />
            News
            <span className="h-px flex-1 bg-white/20" />
          </div>
          <Link href={`/novita/${visibleItems[current]?.slug?.current || visibleItems[current]?._id}`}>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
              {getTextValue(visibleItems[current]?.title)}
            </h3>
          </Link>
          {visibleItems[current]?.miniIntro && (
            <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
              {getTextValue(visibleItems[current].miniIntro)}
            </p>
          )}
        </div>

        <div className="flex flex-row flex-wrap items-center gap-2 md:gap-3 lg:gap-4 mt-4 md:mt-6 flex-shrink-0">
          <Link
            href={`/novita/${visibleItems[current]?.slug?.current || visibleItems[current]?._id}`}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:brightness-110 whitespace-nowrap flex-1 min-w-[120px]"
          >
            Leggi la novità
            <svg className="ml-2 h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="flex flex-row gap-2 md:gap-3 flex-shrink-0">
            <button
              onClick={() => {
                goToPrev();
                setAutoPlay(false);
              }}
              className="inline-flex items-center justify-center rounded-full px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur shadow-lg transition-all whitespace-nowrap"
            >
              Precedente
            </button>
            <button
              onClick={() => {
                goToNext();
                setAutoPlay(false);
              }}
              className="inline-flex items-center justify-center rounded-full px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur shadow-lg transition-all whitespace-nowrap"
            >
              Successiva
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NovitaCarousel;

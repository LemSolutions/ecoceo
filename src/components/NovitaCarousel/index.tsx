"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { safeFetch } from '@/sanity/lib/client';
import { novitaQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';

const AUTO_INTERVAL = 1000;

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
      <div className="text-center py-12 text-white/70">
        Caricamento novità...
      </div>
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
      <div className="relative h-[280px] sm:h-[360px] lg:h-full lg:min-h-[480px] bg-black/40 flex items-center justify-center">
        {visibleItems[current]?.mainImage ? (
          <Image
            src={getImageUrl(visibleItems[current].mainImage)}
            alt={getTextValue(visibleItems[current].title)}
            fill
            className="object-contain"
            sizes="(min-width: 1280px) 60vw, (min-width: 768px) 70vw, 100vw"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-lg font-semibold">
            Novità LEM
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute top-6 left-6 inline-flex items-center rounded-full bg-white/95 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600 shadow-lg shadow-black/20">
          {new Date(visibleItems[current]?._createdAt || Date.now()).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>

      <div className="p-8 lg:p-10 space-y-6">
        <div className="flex items-center text-xs uppercase tracking-[0.3em] text-white/60 gap-2">
          <span className="h-px flex-1 bg-white/20" />
          News
          <span className="h-px flex-1 bg-white/20" />
        </div>
        <Link href={`/novita/${visibleItems[current]?.slug?.current || visibleItems[current]?._id}`}>
          <h3 className="text-3xl font-bold text-white leading-tight">
            {getTextValue(visibleItems[current]?.title)}
          </h3>
        </Link>
        {visibleItems[current]?.miniIntro && (
          <p className="text-white/80 text-base leading-relaxed line-clamp-5 lg:line-clamp-6">
            {getTextValue(visibleItems[current].miniIntro)}
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          <Link
            href={`/novita/${visibleItems[current]?.slug?.current || visibleItems[current]?._id}`}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:brightness-110"
          >
            Leggi la novità
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <button
            onClick={() => {
              goToPrev();
              setAutoPlay(false);
            }}
            className="inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
          >
            Precedente
          </button>
          <button
            onClick={() => {
              goToNext();
              setAutoPlay(false);
            }}
            className="inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
          >
            Successiva
          </button>
        </div>
      </div>
    </article>
  );
};

export default NovitaCarousel;

"use client";

import { safeFetch } from '@/sanity/lib/client';
import { testimonialsQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect, useMemo } from 'react';

const AUTO_SCROLL_INTERVAL = 3000;
const TRANSITION_DURATION = 1800;
const GAP_PX = 32; // gap-8 in Tailwind

const SingleTestimonial = ({ testimonial, index }) => {
  const { getComponent } = useSanityUIComponents();
  const testimonialCardComponent = getComponent('TestimonialCard');
  const testimonialContentComponent = getComponent('TestimonialContent');
  const testimonialAuthorComponent = getComponent('TestimonialAuthor');

  return (
    <SanityStyledComponent
      component={testimonialCardComponent}
      componentName="TestimonialCard"
      className="w-full"
    >
      <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
        <div className="group/tes relative rounded-sm bg-white/30 backdrop-blur/30 backdrop-blurp-8 shadow-testimonial dark:bg-dark lg:px-12 xl:p-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                {testimonial.image ? (
                  <img
                    src={getImageUrl(testimonial.image)}
                    alt={getTextValue(testimonial.name)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">{getTextValue(testimonial.name)?.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div>
                <SanityStyledComponent
                  component={testimonialAuthorComponent}
                  componentName="TestimonialAuthor"
                  as="h3"
                  className="text-xl font-semibold text-dark dark:text-white"
                >
                  {getTextValue(testimonial.name)}
                </SanityStyledComponent>
                <p className="text-sm text-body-color">{getTextValue(testimonial.designation)}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500">
                  {i < (testimonial.star || 5) ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>
          <SanityStyledComponent
            component={testimonialContentComponent}
            componentName="TestimonialContent"
            as="p"
            className="mt-8 text-base leading-relaxed text-body-color dark:text-body-color-dark"
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsData = await safeFetch(testimonialsQuery);
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching testimonials data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-scroll logic
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      if (width >= 1280) {
        setCardsPerView(3);
      } else if (width >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  useEffect(() => {
    if (testimonials.length <= cardsPerView) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, AUTO_SCROLL_INTERVAL);
    return () => clearTimeout(timer);
  }, [testimonials.length, cardsPerView, currentIndex]);

  useEffect(() => {
    if (testimonials.length <= cardsPerView) return;
    if (currentIndex >= testimonials.length) {
      setTransitionEnabled(false);
      setCurrentIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionEnabled(true));
      });
    }
  }, [currentIndex, testimonials.length, cardsPerView]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [cardsPerView, testimonials.length]);

  const extendedTestimonials = useMemo(() => {
    if (testimonials.length <= cardsPerView) return testimonials;
    return [...testimonials, ...testimonials.slice(0, cardsPerView)];
  }, [testimonials, cardsPerView]);

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

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-8"
        style={{
          transform: `translateX(calc(-${(100 / cardsPerView) * currentIndex}% - ${GAP_PX * currentIndex}px))`,
          width: `calc(${(100 / cardsPerView) * extendedTestimonials.length}% + ${(extendedTestimonials.length - 1) * GAP_PX}px)`,
          transition: transitionEnabled
            ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
            : 'none',
        }}
      >
        {extendedTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial._id || 'testimonial'}-${index}`}
            className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
          >
            <SingleTestimonial testimonial={testimonial} index={index} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Testimonials;

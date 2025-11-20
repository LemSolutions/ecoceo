"use client";

import Link from "next/link";
import Image from "next/image";
import { safeFetch } from '@/sanity/lib/client';
import { homepageServicesQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect, useCallback, type CSSProperties } from 'react';

const BASE_CARD_STYLE: CSSProperties = {
  transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)',
  boxShadow: '0 18px 35px -25px rgba(15, 23, 42, 0.55)',
  transition: 'transform 0.35s ease-out, box-shadow 0.35s ease-out',
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardTransforms, setCardTransforms] = useState<Record<number, React.CSSProperties>>({});
  const { getComponent } = useSanityUIComponents();

  const handleMouseMove = useCallback((index: number) => (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rotateX = ((y - bounds.height / 2) / bounds.height) * -10;
    const rotateY = ((x - bounds.width / 2) / bounds.width) * 10;

    setCardTransforms((prev) => ({
      ...prev,
      [index]: {
        transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
          2,
        )}deg) translateZ(10px)`,
        boxShadow: '0 22px 45px -20px rgba(15, 23, 42, 0.65)',
        transition: 'transform 0.09s ease-out, box-shadow 0.12s ease-out',
      },
    }));
  }, []);

  const handleMouseLeave = useCallback((index: number) => () => {
    setCardTransforms((prev) => ({
      ...prev,
      [index]: BASE_CARD_STYLE,
    }));
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await safeFetch(homepageServicesQuery);
        setServices(servicesData || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get UI components for Services section
  const servicesSectionComponent = getComponent('ServicesSection');
  const serviceCardComponent = getComponent('ServiceCard');
  const serviceTitleComponent = getComponent('ServiceTitle');
  const serviceDescriptionComponent = getComponent('ServiceDescription');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento servizi...</p>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Sezione Servizi</h3>
        <p className="text-gray-600 mb-6">Crea i tuoi servizi in Sanity Studio per iniziare.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Vai a Sanity Studio
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <SanityStyledComponent
            key={service._id || index}
            component={serviceCardComponent}
            componentName="ServiceCard"
            className="w-full"
          >
            <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
              <div
                className="group relative overflow-hidden rounded-lg bg-white/30 backdrop-blur/30 backdrop-blurshadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark h-full"
                style={cardTransforms[index] || BASE_CARD_STYLE}
                onMouseMove={handleMouseMove(index)}
                onMouseLeave={handleMouseLeave(index)}
              >
                <div className="p-10">
                  <div className="mb-8 flex h-[100px] w-[100px] items-center justify-center rounded-lg overflow-hidden">
                    {service.image ? (
                      <Image
                        src={getImageUrl(service.image)}
                        alt={getTextValue(service.name)}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary bg-opacity-10 flex items-center justify-center text-5xl">
                        {service.icon || "💼"}
                      </div>
                    )}
                  </div>
                  
                  <SanityStyledComponent
                    component={serviceTitleComponent}
                    componentName="ServiceTitle"
                    as="h3"
                    className="mb-6 text-2xl font-bold text-dark dark:text-white"
                  >
                    {getTextValue(service.name)}
                  </SanityStyledComponent>
                  
                  <SanityStyledComponent
                    component={serviceDescriptionComponent}
                    componentName="ServiceDescription"
                    as="p"
                    className="mb-8 text-lg text-body-color dark:text-body-color-dark leading-relaxed"
                  >
                    {getTextValue(service.shortDescription)}
                  </SanityStyledComponent>

                  {service.features && service.features.length > 0 && (
                    <div className="mb-8">
                      <ul className="space-y-3">
                        {service.features.slice(0, 4).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-base text-body-color dark:text-body-color-dark">
                            <svg
                              className="mr-3 h-5 w-5 text-primary"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {getTextValue(feature)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <Link
                      href={service.url || `/services/${service.slug?.current}`}
                      className="inline-flex items-center text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200 group"
                    >
                      Scopri di più
                      <svg
                        className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200"
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
                    <Link
                      href="/contact?subject=QUOTE"
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-red-500 hover:to-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                    >
                      Richiedi Preventivo Gratuito
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SanityStyledComponent>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
        <a
          href="mailto:commerciale@lemsolutions.it?subject=QUOTE LEM SOLUTIONS CERAMIC SYSTEMS"
          className="hero-button-flash inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          Chiedi un Preventivo Gratuito
        </a>
          <Link
            href="/contact?subject=CONSULTING"
            className="group inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60"
          >
          Prenota una Consulenza
        </Link>
        <Link
          href="/contact?subject=INFO"
          className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-primary shadow-lg shadow-white/30 transition-all duration-200 hover:translate-y-[-2px] hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Contattaci Subito
        </Link>
      </div>
    </div>
  );
};

export default Services;

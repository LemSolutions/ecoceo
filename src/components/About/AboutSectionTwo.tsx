"use client";

import Image from "next/image";
import { safeFetch } from '@/sanity/lib/client';
import { aboutQuery, aboutFallbackQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect } from 'react';

const AboutSectionTwo = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        // Try to fetch active about section first
        let aboutData = await safeFetch(aboutQuery);
        
        // If no active section found, try fallback
        if (!aboutData) {
          console.log('No active about section found, trying fallback...');
          aboutData = await safeFetch(aboutFallbackQuery);
        }
        
        setAbout(aboutData);
      } catch (error) {
        console.error('Error fetching about data:', error);
        setAbout(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // Get UI components for About section
  const aboutSectionComponent = getComponent('AboutSection');
  const aboutTitleComponent = getComponent('AboutTitle');
  const aboutDescriptionComponent = getComponent('AboutDescription');
  const aboutFeatureComponent = getComponent('AboutFeature');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento sezione About...</p>
      </div>
    );
  }

  // Se non ci sono dati da Sanity, non mostrare nulla
  if (!about) {
    return null;
  }

  return (
    <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
      <div className="-mx-4 flex flex-wrap items-center">
        <div className="w-full px-4 lg:w-1/2">
          <div className="relative mx-auto aspect-25/24 max-w-[500px] lg:mr-0">
            {about.image ? (
              <Image
                src={getImageUrl(about.image)}
                alt="about-image"
                fill
                className="mx-auto max-w-full drop-shadow-three dark:drop-shadow-none lg:mr-0"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Add an image in Sanity Studio</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full px-4 lg:w-1/2">
          <SanityStyledComponent
            component={aboutTitleComponent}
            componentName="AboutTitle"
            as="div"
          >
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
              {getTextValue(about.title)}
            </h3>
            <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
              {getTextValue(about.description)}
            </p>
          </SanityStyledComponent>

          {about.features && about.features.length > 0 && (
            <div className="mt-8">
              {about.features.map((feature, index) => (
                <div key={index} className="mb-6">
                  <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
                    {getTextValue(feature.title)}
                  </h4>
                  {feature.description && (
                    <p className="text-base font-medium leading-relaxed text-body-color">
                      {getTextValue(feature.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {about.stats && about.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-8">
              {about.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary">{getTextValue(stat.number)}</div>
                  <div className="text-sm text-gray-600">{getTextValue(stat.label)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutSectionTwo;

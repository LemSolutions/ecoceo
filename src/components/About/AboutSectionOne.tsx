"use client";

import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import { safeFetch } from '@/sanity/lib/client';
import { aboutQuery, aboutFallbackQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect } from 'react';

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutSectionOne = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        console.log('🔍 AboutSectionOne: Starting to fetch About data...');
        
        // Try to fetch active about section first
        let aboutData = await safeFetch(aboutQuery);
        console.log('📊 AboutSectionOne: Active query result:', aboutData);
        
        // If no active section found, try fallback
        if (!aboutData) {
          console.log('⚠️ AboutSectionOne: No active about section found, trying fallback...');
          aboutData = await safeFetch(aboutFallbackQuery);
          console.log('📊 AboutSectionOne: Fallback query result:', aboutData);
        }
        
        console.log('✅ AboutSectionOne: Final about data:', aboutData);
        setAbout(aboutData);
      } catch (error) {
        console.error('❌ AboutSectionOne: Error fetching about data:', error);
        console.error('❌ AboutSectionOne: Error details:', {
          message: error.message,
          statusCode: error.statusCode,
          response: error.response
        });
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

  const List = ({ text, icon }) => (
    <SanityStyledComponent
      component={aboutFeatureComponent}
      componentName="AboutFeature"
      as="p"
      className="text-body-color mb-5 flex items-center text-lg font-medium"
    >
      <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
        {icon || checkIcon}
      </span>
      {getTextValue(text)}
    </SanityStyledComponent>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento sezione About...</p>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        {/* Left Column - Text Content */}
        <div className="w-full px-4 lg:w-1/2">
          <div className="wow fadeInUp" data-wow-delay=".2s">
            <div className="mb-9">
              <h3 className="mb-4 text-xl font-bold text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Chi Siamo
              </h3>
              <p className="text-base font-medium leading-relaxed text-white/80 sm:text-lg sm:leading-relaxed">
                Siamo LEM Solutions, un'azienda specializzata nello sviluppo di soluzioni digitali innovative. 
                Con anni di esperienza nel settore, aiutiamo le aziende a trasformare la loro presenza digitale 
                e raggiungere i loro obiettivi di business attraverso tecnologie all'avanguardia.
              </p>
            </div>
            
            <div className="mb-9">
              <h3 className="mb-4 text-xl font-bold text-white sm:text-2xl lg:text-xl xl:text-2xl">
                La Nostra Missione
              </h3>
              <p className="text-base font-medium leading-relaxed text-white/80 sm:text-lg sm:leading-relaxed">
                La nostra missione è quella di aiutare le aziende a crescere nel mondo digitale attraverso 
                soluzioni innovative e personalizzate. Crediamo che ogni business abbia un potenziale unico 
                che può essere espresso attraverso la tecnologia.
              </p>
            </div>

            <div className="mb-9">
              <h3 className="mb-4 text-xl font-bold text-white sm:text-2xl lg:text-xl xl:text-2xl">
                I Nostri Valori
              </h3>
              <p className="text-base font-medium leading-relaxed text-white/80 sm:text-lg sm:leading-relaxed">
                L'innovazione, la qualità e la trasparenza sono i pilastri su cui fondiamo il nostro lavoro. 
                Ogni progetto è un'opportunità per superare le aspettative e creare valore duraturo per i nostri clienti.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="bg-blue-500/20 text-blue-400 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
                  ✓
                </span>
                <p className="text-white text-lg font-medium">
                  Sviluppo Web Personalizzato
                </p>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500/20 text-blue-400 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
                  ✓
                </span>
                <p className="text-white text-lg font-medium">
                  Design Responsive e Moderno
                </p>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500/20 text-blue-400 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
                  ✓
                </span>
                <p className="text-white text-lg font-medium">
                  Consulenza IT Specializzata
                </p>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500/20 text-blue-400 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
                  ✓
                </span>
                <p className="text-white text-lg font-medium">
                  Supporto Tecnico Completo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="w-full px-4 lg:w-1/2">
          <div className="wow fadeInUp" data-wow-delay=".4s">
            <div className="relative mx-auto aspect-25/24 max-w-[500px] lg:mr-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">💻</div>
                  <h3 className="text-white text-xl font-bold mb-2">LEM Solutions</h3>
                  <p className="text-white/80">Soluzioni Digitali Innovative</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
      <div className="-mx-4 flex flex-wrap items-center">
        <div className="w-full px-4 lg:w-1/2">
          <SanityStyledComponent
            component={aboutTitleComponent}
            componentName="AboutTitle"
            as="div"
          >
            <SectionTitle
              title={getTextValue(about.title)}
              paragraph={getTextValue(about.description)}
              mb="44px"
            />
          </SanityStyledComponent>

          {about.features && about.features.length > 0 && (
            <div
              className="mb-12 max-w-[570px] lg:mb-0"
              data-wow-delay=".15s"
            >
              <div className="mx-[-12px] flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                  {about.features.slice(0, Math.ceil(about.features.length / 2)).map((feature, index) => (
                    <List key={index} text={feature.title} icon={feature.icon} />
                  ))}
                </div>

                <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                  {about.features.slice(Math.ceil(about.features.length / 2)).map((feature, index) => (
                    <List key={index} text={feature.title} icon={feature.icon} />
                  ))}
                </div>
              </div>
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
      </div>
    </div>
  );
};

export default AboutSectionOne;

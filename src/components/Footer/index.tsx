"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from '@/sanity/lib/image';
import { safeFetch } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await safeFetch(siteSettingsQuery);
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  return (
    <>
      <footer className="relative z-10 text-white pt-8" style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Colonna 1: Link Rapidi */}
            <div className="mb-12 lg:mb-16">
              <h3 className="text-white mb-8 text-xl font-semibold">
                Link Rapidi
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-white hover:text-orange-300 text-base font-medium transition duration-300"
                  >
                    Chi Siamo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-white hover:text-orange-300 text-base font-medium transition duration-300"
                  >
                    Servizi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white hover:text-orange-300 text-base font-medium transition duration-300"
                  >
                    Contatti
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-white hover:text-orange-300 text-base font-medium transition duration-300"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonna 2: Servizi */}
            <div className="mb-12 lg:mb-16">
              <h3 className="text-white mb-8 text-xl font-semibold">
                Servizi
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/services"
                    className="text-white hover:text-orange-300 text-base font-medium transition duration-300"
                  >
                    Web Design
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-white hover:text-orange-300 text-base font-medium transition duration-300"
                  >
                    Sviluppo Web
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-white hover:text-orange-300 text-base font-medium transition duration-300"
                  >
                    E-commerce
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-white hover:text-orange-300 text-base font-medium transition duration-300"
                  >
                    Consulenza IT
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonna 3: Informazioni Aziendali */}
            <div className="mb-12 lg:mb-16">
              <h3 className="text-white mb-8 text-xl font-semibold">
                LEM Solutions S.N.C.
              </h3>
              
              {/* Informazioni Aziendali */}
              <div className="space-y-4">
                <div>
                  <p className="text-white text-sm font-medium mb-1">
                    Ragione sociale
                  </p>
                  <p className="text-white text-sm leading-relaxed">
                    Lem Solutions S.N.C. di Morano Lino Carmine & Ferrario Massimiliano
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white text-sm font-medium mb-1">
                      P.IVA
                    </p>
                    <p className="text-white text-sm">
                      IT02961500135
                    </p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">
                      C.U.
                    </p>
                    <p className="text-white text-sm">
                      M5UXCR1
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-white text-sm font-medium mb-1">
                    Sede
                  </p>
                  <p className="text-white text-sm leading-relaxed">
                    Via Gondar 6<br />
                    Monza (MB) 20900
                  </p>
                </div>
              </div>

              {/* Contatti */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blur/20 mr-3 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      className="fill-current text-white"
                    >
                      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                      <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">
                      Email
                    </p>
                    <a 
                      href="mailto:info@lemsolutions.it"
                      className="text-white hover:text-orange-300 text-sm transition duration-300"
                    >
                      info@lemsolutions.it
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blur/20 mr-3 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      className="fill-current text-white"
                    >
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.8 11.85a.678.678 0 0 1-.656-.227L7.682 9.94a.678.678 0 0 0-.122-.58L5.78 7.05a.678.678 0 0 0-.122-.58L7.682 5.38a.678.678 0 0 1 .227-.656L9.8 3.15a.678.678 0 0 0 .656-.227L12.02 1.282a.678.678 0 0 0-.063-1.015L9.75.273z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">
                      Telefono
                    </p>
                    <a 
                      href="tel:+393474806300"
                      className="text-white hover:text-orange-300 text-sm transition duration-300"
                    >
                      +39 347 4806300
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mappa Google Maps */}
        <div className="border-t border-gray-300/30 py-6">
          <div className="container">
            <div className="mb-6">
              <h3 className="text-white text-lg font-semibold text-center mb-4">
                La Nostra Sede
              </h3>
              <div className="max-w-3xl mx-auto">
                <iframe 
                  src="https://www.google.com/maps?q=Via+Gondar+6,+Monza+(MB)+20900&output=embed" 
                  width="100%" 
                  height="200" 
                  style={{
                    border: 0,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade" 
                  title="LEM Solutions Sede"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300/50 py-8">
          <div className="container">
            <div className="-mx-4 flex flex-wrap items-center justify-between">
              <div className="w-full px-4 md:w-2/3 lg:w-1/2">
                <div className="text-center md:text-left">
                  <p className="text-white text-base">
                    &copy; 2025 LEM Solutions S.N.C. Tutti i diritti riservati.
                  </p>
                </div>
              </div>
              <div className="w-full px-4 md:w-1/3 lg:w-1/2">
                <div className="text-center md:text-right">
                  <p className="text-white text-base">
                    {siteSettings?.footer?.developerCredit?.text || "Designed and Developed by"}{" "}
                    <Link
                      href={siteSettings?.footer?.developerCredit?.companyUrl || "https://tailgrids.com"}
                      className="text-white hover:text-orange-300 font-semibold transition duration-300"
                    >
                      {siteSettings?.footer?.developerCredit?.companyName || "TailGrids"}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Legal Links */}
            {siteSettings?.legal && (
              <div className="mt-4 pt-4 border-t border-gray-300/30">
                <div className="flex flex-wrap justify-center gap-6">
                  {siteSettings.legal.privacyPolicy && (
                    <Link
                      href={`/legal/${siteSettings.legal.privacyPolicy.slug?.current || 'privacy-policy'}`}
                      className="text-gray-300 hover:text-orange-300 text-sm transition duration-300"
                    >
                      {siteSettings.legal.privacyPolicy.title}
                    </Link>
                  )}
                  {siteSettings.legal.termsOfService && (
                    <Link
                      href={`/legal/${siteSettings.legal.termsOfService.slug?.current || 'terms-of-service'}`}
                      className="text-gray-300 hover:text-orange-300 text-sm transition duration-300"
                    >
                      {siteSettings.legal.termsOfService.title}
                    </Link>
                  )}
                  {siteSettings.legal.cookiePolicy && (
                    <Link
                      href={`/legal/${siteSettings.legal.cookiePolicy.slug?.current || 'cookie-policy'}`}
                      className="text-gray-300 hover:text-orange-300 text-sm transition duration-300"
                    >
                      {siteSettings.legal.cookiePolicy.title}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

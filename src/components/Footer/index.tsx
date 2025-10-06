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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

            {/* Colonna 2: Informazioni Aziendali */}
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

          {/* Social Media Section */}
          <div className="border-t border-gray-300/30 py-8 mt-8">
            <div className="text-center">
              <h3 className="text-white text-2xl font-bold mb-6">Seguici sui Social</h3>
              <div className="flex justify-center space-x-6">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/lemsolutionsmonza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur/30 hover:bg-white/30 flex h-16 w-16 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out transform hover:scale-110"
                  title="Seguici su Facebook"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/lem_photoceramic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur/30 hover:bg-white/30 flex h-16 w-16 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out transform hover:scale-110"
                  title="Seguici su Instagram"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/105386112/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur/30 hover:bg-white/30 flex h-16 w-16 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out transform hover:scale-110"
                  title="Seguici su LinkedIn"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/watch?v=5Rpkhvj0eWY&pp=0gcJCfsJAYcqIYzv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur/30 hover:bg-white/30 flex h-16 w-16 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out transform hover:scale-110"
                  title="Seguici su YouTube"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
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
                      className="text-white hover:text-orange-300 text-sm transition duration-300"
                    >
                      {siteSettings.legal.privacyPolicy.title}
                    </Link>
                  )}
                  {siteSettings.legal.termsOfService && (
                    <Link
                      href={`/legal/${siteSettings.legal.termsOfService.slug?.current || 'terms-of-service'}`}
                      className="text-white hover:text-orange-300 text-sm transition duration-300"
                    >
                      {siteSettings.legal.termsOfService.title}
                    </Link>
                  )}
                  {siteSettings.legal.cookiePolicy && (
                    <Link
                      href={`/legal/${siteSettings.legal.cookiePolicy.slug?.current || 'cookie-policy'}`}
                      className="text-white hover:text-orange-300 text-sm transition duration-300"
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

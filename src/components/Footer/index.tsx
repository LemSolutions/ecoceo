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
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link href="/" className="mb-8 inline-block">
                  {siteSettings?.logo ? (
                    <Image
                      src={getImageUrl(siteSettings.logo)}
                      alt="logo"
                      width={140}
                      height={30}
                      className="w-full dark:hidden"
                    />
                  ) : (
                    <Image
                      src="/images/logo/logo-2.svg"
                      alt="logo"
                      width={140}
                      height={30}
                      className="w-full dark:hidden"
                    />
                  )}
                  {siteSettings?.logoDark ? (
                    <Image
                      src={getImageUrl(siteSettings.logoDark)}
                      alt="logo"
                      width={140}
                      height={30}
                      className="hidden w-full dark:block"
                    />
                  ) : (
                    <Image
                      src="/images/logo/logo.svg"
                      alt="logo"
                      width={140}
                      height={30}
                      className="hidden w-full dark:block"
                    />
                  )}
                </Link>
                <p className="text-white mb-9 text-base font-medium leading-relaxed">
                  {siteSettings?.description || "We are a team of passionate designers and developers who love to create beautiful and functional websites."}
                </p>
                <div className="flex items-center space-x-4">
                  <Link
                    href={siteSettings?.socialLinks?.facebook || "#"}
                    className="bg-white/30 backdrop-blur/30 backdrop-blur/20 hover:bg-white/30 backdrop-blur/30 backdrop-blur/30 flex h-10 w-10 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="fill-current"
                    >
                      <path d="M9 5.9V4H7V5.9H6V8H7V15H9V8H11L12 5.9H9Z" />
                    </svg>
                  </Link>
                  <Link
                    href={siteSettings?.socialLinks?.twitter || "#"}
                    className="bg-white/30 backdrop-blur/30 backdrop-blur/20 hover:bg-white/30 backdrop-blur/30 backdrop-blur/30 flex h-10 w-10 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="fill-current"
                    >
                      <path d="M15.3 4.3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.4-1-2.3-1-1.7 0-3.1 1.4-3.1 3.1 0 .2 0 .5.1.7-2.6-.1-4.9-1.4-6.4-3.3-.3.4-.4.9-.4 1.4 0 1.1.6 2 1.4 2.6-.5 0-1-.2-1.4-.4v.1c0 1.5 1.1 2.8 2.5 3.1-.3.1-.5.1-.8.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.2 3 2.2-1.1.9-2.5 1.4-4 1.4-.3 0-.5 0-.8-.1 1.4.9 3 1.4 4.8 1.4 5.7 0 8.9-4.7 8.9-8.9v-.4c.6-.5 1.2-1.1 1.6-1.8z" />
                    </svg>
                  </Link>
                  <Link
                    href={siteSettings?.socialLinks?.instagram || "#"}
                    className="bg-white/30 backdrop-blur/30 backdrop-blur/20 hover:bg-white/30 backdrop-blur/30 backdrop-blur/30 flex h-10 w-10 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="fill-current"
                    >
                      <path d="M8 2.2c2.1 0 2.4.01 3.2.06.8.05 1.3.2 1.6.4.4.2.7.5.9.9.2.3.4.8.4 1.6.1.8.1 1.1.1 3.2s0 2.4-.1 3.2c-.1.8-.2 1.3-.4 1.6-.2.4-.5.7-.9.9-.3.2-.8.4-1.6.4-.8.1-1.1.1-3.2.1s-2.4 0-3.2-.1c-.8-.1-1.3-.2-1.6-.4-.4-.2-.7-.5-.9-.9-.2-.3-.4-.8-.4-1.6-.1-.8-.1-1.1-.1-3.2s0-2.4.1-3.2c.1-.8.2-1.3.4-1.6.2-.4.5-.7.9-.9.3-.2.8-.4 1.6-.4.8-.1 1.1-.1 3.2-.1zm0-1.4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6.6c-1.4 0-2.6-1.2-2.6-2.6s1.2-2.6 2.6-2.6 2.6 1.2 2.6 2.6-1.2 2.6-2.6 2.6zm5.3-6.7c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9z" />
                    </svg>
                  </Link>
                  <Link
                    href={siteSettings?.socialLinks?.linkedin || "#"}
                    className="bg-white/30 backdrop-blur/30 backdrop-blur/20 hover:bg-white/30 backdrop-blur/30 backdrop-blur/30 flex h-10 w-10 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="fill-current"
                    >
                      <path d="M15.3 0H.7C.3 0 0 .3 0 .7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V.7c0-.4-.3-.7-.7-.7zM4.7 13.6H2.4V6h2.4v7.6h-.1zM3.6 5c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10.9 8.6h-2.4V9.9c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8H6.7V6h2.3v1h.1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2h.1z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full px-4 sm:w-2/3 md:w-1/2 lg:w-2/12 xl:w-1/6">
              <div className="mb-12 lg:mb-16">
                <h3 className="text-white mb-10 text-xl font-semibold">
                  {siteSettings?.footer?.quickLinksTitle || "Quick Links"}
                </h3>
                <ul>
                  {siteSettings?.footer?.quickLinks ? (
                    siteSettings.footer.quickLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.url}
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <>
                      <li>
                        <Link
                          href="/about"
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/blog"
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          Blog
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/contact"
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services"
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          Services
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/3 lg:w-2/12 xl:w-1/6">
              <div className="mb-12 lg:mb-16">
                <h3 className="text-white mb-10 text-xl font-semibold">
                  {siteSettings?.footer?.servicesTitle || "Services"}
                </h3>
                <ul>
                  {siteSettings?.footer?.services ? (
                    siteSettings.footer.services.map((service, index) => (
                      <li key={index}>
                        <Link
                          href={service.url}
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          {service.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <>
                      <li>
                        <Link
                          href="/services"
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          Web Design
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services"
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          Web Development
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services"
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          E-commerce
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services"
                          className="text-gray-300 hover:text-orange-300 mb-4 inline-block text-base font-medium transition duration-300"
                        >
                          IT Consulting
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="w-full px-4 md:w-2/3 lg:w-4/12 xl:w-2/6">
              <div className="mb-12 lg:mb-16">
                <h3 className="text-white mb-10 text-xl font-semibold">
                  LEM Solutions S.N.C.
                </h3>
                
                {/* Ragione Sociale */}
                <div className="mb-6">
                  <p className="text-gray-300 text-sm font-medium mb-2">
                    Ragione sociale:
                  </p>
                  <p className="text-white text-base leading-relaxed">
                    Lem Solutions S.N.C. di Morano Lino Carmine & Ferrario Massimiliano
                  </p>
                </div>

                {/* P.IVA e C.U. */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-300 text-sm font-medium mb-1">
                      P.IVA:
                    </p>
                    <p className="text-white text-base">
                      IT02961500135
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium mb-1">
                      C.U.:
                    </p>
                    <p className="text-white text-base">
                      M5UXCR1
                    </p>
                  </div>
                </div>

                {/* Indirizzo */}
                <div className="mb-6">
                  <p className="text-gray-300 text-sm font-medium mb-2">
                    Sede:
                  </p>
                  <p className="text-white text-base leading-relaxed">
                    Via Gondar 6<br />
                    Monza (MB) 20900
                  </p>
                </div>

                {/* Contatti */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-white/30 backdrop-blur/30 backdrop-blur/20 mr-4 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="fill-current text-white"
                      >
                        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                        <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm font-medium mb-1">
                        Email:
                      </p>
                      <a 
                        href="mailto:info@lemsolutions.it"
                        className="text-white hover:text-orange-300 text-base transition duration-300"
                      >
                        info@lemsolutions.it
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-white/30 backdrop-blur/30 backdrop-blur/20 mr-4 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="fill-current text-white"
                      >
                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.8 11.85a.678.678 0 0 1-.656-.227L7.682 9.94a.678.678 0 0 0-.122-.58L5.78 7.05a.678.678 0 0 0-.122-.58L7.682 5.38a.678.678 0 0 1 .227-.656L9.8 3.15a.678.678 0 0 0 .656-.227L12.02 1.282a.678.678 0 0 0-.063-1.015L9.75.273z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm font-medium mb-1">
                        Telefono:
                      </p>
                      <a 
                        href="tel:+393474806300"
                        className="text-white hover:text-orange-300 text-base transition duration-300"
                      >
                        +39 347 4806300
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mappa Google Maps */}
        <div className="border-t border-gray-300/30 py-8">
          <div className="container">
            <div className="mb-8">
              <h3 className="text-white text-xl font-semibold text-center mb-6">
                📍 La Nostra Sede
              </h3>
              <div className="max-w-4xl mx-auto">
                <iframe 
                  src="https://www.google.com/maps?q=Via+Gondar+6,+Monza+(MB)+20900&output=embed" 
                  width="100%" 
                  height="220" 
                  style={{
                    border: 0,
                    borderRadius: '12px',
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

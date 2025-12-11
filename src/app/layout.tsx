"use client";

import dynamic from 'next/dynamic';
import Script from 'next/script';
import { Inter, Poppins, Roboto, Open_Sans, Montserrat, Lato } from "next/font/google";
import { Providers } from "./providers";
import { CartProvider } from "@/contexts/CartContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import "../styles/index.css";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { client } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@/lib/fontawesome';

// Tell Font Awesome to skip adding the CSS automatically
config.autoAddCss = false;

// Preload dei font più comuni per ottimizzazione
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false, // Preload solo quando necessario
  variable: '--font-poppins',
});

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-roboto',
});

const openSans = Open_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-open-sans',
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-montserrat',
});

const lato = Lato({ 
  subsets: ["latin"],
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-lato',
});

// Lazy load components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/Common/CookieConsent"), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudioPage = pathname?.startsWith('/studio');
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isClientAreaPage = pathname?.startsWith('/area-clienti');
  const [siteSettings, setSiteSettings] = useState(null);

  // Font mapping per Sanity
  const fontMap: Record<string, any> = {
    'Inter': inter,
    'Poppins': poppins,
    'Roboto': roboto,
    'Open Sans': openSans,
    'Montserrat': montserrat,
    'Lato': lato,
  };

  // Seleziona i font in base alle impostazioni
  const headingFont = useMemo(() => {
    const fontName = siteSettings?.typography?.headingFont || 'Inter';
    return fontMap[fontName] || inter;
  }, [siteSettings?.typography?.headingFont]);

  const bodyFont = useMemo(() => {
    const fontName = siteSettings?.typography?.bodyFont || 'Inter';
    return fontMap[fontName] || inter;
  }, [siteSettings?.typography?.bodyFont]);


  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await client.fetch(siteSettingsQuery);
        setSiteSettings(settings);
        

      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    if (!isStudioPage && !isDashboardPage && !isClientAreaPage) {
      fetchSiteSettings();
    }
  }, [isStudioPage, isDashboardPage, isClientAreaPage]);

  // Combina le classi dei font
  const fontClasses = `${inter.variable} ${headingFont.variable} ${bodyFont.variable}`;

  return (
    <html suppressHydrationWarning lang="en" className={fontClasses}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {siteSettings?.favicon && (
          <link rel="icon" href={siteSettings.favicon} />
        )}
        <title>{siteSettings?.title || 'LEM Solutions | Fotoceramica Professionale'}</title>
        <meta
          name="description"
          content={
            siteSettings?.description ||
            "LEM Solutions offre consulenza, prodotti e supporto per la fotoceramica professionale."
          }
        />

        {/* Preconnect per Google Fonts (ottimizzazione) - non più necessario con next/font */}
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5JF0637T6F"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5JF0637T6F');
          `}
        </Script>
      </head>
      <body 
        className={`${bodyFont.className} dynamic-gradient-bg`}
        style={{
          '--font-heading': `var(${headingFont.variable})`,
          '--font-body': `var(${bodyFont.variable})`,
        } as React.CSSProperties}
      >
        <Providers>
          <CartProvider>
            <AnalyticsProvider>
              {!isStudioPage && !isDashboardPage && !isClientAreaPage && <Header siteSettings={siteSettings} />}
              {children}
              {!isStudioPage && !isDashboardPage && !isClientAreaPage && <Footer />}
              {!isStudioPage && !isDashboardPage && !isClientAreaPage && <ScrollToTop />}
              {!isStudioPage && !isDashboardPage && !isClientAreaPage && <CookieConsent />}
            </AnalyticsProvider>
          </CartProvider>
        </Providers>
        
        {/* Iubenda Script - caricato dopo il rendering */}
        <Script
          id="iubenda-script"
          strategy="lazyOnload"
        >
          {`(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`}
        </Script>
      </body>
    </html>
  );
}


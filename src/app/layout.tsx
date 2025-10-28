"use client";

import dynamic from 'next/dynamic';
import Script from 'next/script';
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { CartProvider } from "@/contexts/CartContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import "../styles/index.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@/lib/fontawesome';

// Tell Font Awesome to skip adding the CSS automatically since it's already imported above
config.autoAddCss = false;


// Lazy load components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

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

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {siteSettings?.favicon && (
          <link rel="icon" href={siteSettings.favicon} />
        )}
        {siteSettings?.description && (
          <meta name="description" content={siteSettings.description} />
        )}

        {/* Load Google Fonts based on typography settings */}
        {siteSettings?.typography?.headingFont && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${siteSettings.typography.headingFont}:wght@400;500;600;700&display=swap`}
            rel="stylesheet"
          />
        )}
        {siteSettings?.typography?.bodyFont && siteSettings.typography.bodyFont !== siteSettings.typography.headingFont && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${siteSettings.typography.bodyFont}:wght@400;500;600&display=swap`}
            rel="stylesheet"
          />
        )}
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5JF0637T6F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5JF0637T6F');
          `}
        </Script>
      </head>
      <body 
        className={`${inter.className} dynamic-gradient-bg`}
        style={{
          fontFamily: siteSettings?.typography?.bodyFont || 'Inter'
        }}
      >
        <Providers>
          <CartProvider>
            <AnalyticsProvider>
              {!isStudioPage && !isDashboardPage && !isClientAreaPage && <Header siteSettings={siteSettings} />}
              {children}
              {!isStudioPage && !isDashboardPage && !isClientAreaPage && <Footer />}
              {!isStudioPage && !isDashboardPage && !isClientAreaPage && <ScrollToTop />}
            </AnalyticsProvider>
          </CartProvider>
        </Providers>
        
        {/* Iubenda Script - caricato dopo il rendering */}
        <Script
          id="iubenda-script"
          src="https://cdn.iubenda.com/iubenda.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}


"use client";

import Link from "next/link";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Services from "@/components/Services";
import Products from "@/components/Products";
import Projects from "@/components/Projects";
import NovitaPopup from "@/components/_public/NovitaPopup";
import { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';

const HomePage = () => {
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
      {/* Hero Section */}
      <div className="text-white">
        <Hero />
      </div>

      {/* Primary CTA Strip */}
      <section className="bg-white/5 py-14 backdrop-blur">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Hai un progetto in mente? Siamo pronti ad aiutarti.
            </h2>
            <p className="mt-4 text-white/80 text-lg">
              Richiedi un preventivo gratuito, prenota una consulenza dedicata oppure contattaci subito per parlare con un esperto.
            </p>
            <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
              <a
                href="mailto:commerciale@lemsolutions.it?subject=QUOTE LEM SOLUTIONS CERAMIC SYSTEMS"
                className="hero-button-flash inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Richiedi Preventivo Gratuito
              </a>
              <Link
                href="/contact?subject=CONSULTING"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/40 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Prenota una Consulenza
              </Link>
              <Link
                href="/contact?subject=INFO"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-primary shadow-lg shadow-white/30 transition-all duration-200 hover:translate-y-[-2px] hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Parla con il Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <Projects
            title="I Nostri Progetti"
            subtitle="Scopri alcune delle realizzazioni che abbiamo seguito dall’idea alla messa in produzione."
            className="text-white"
            containerClassName="px-4 sm:px-6 lg:px-8"
            headingWrapperClassName="max-w-3xl mx-auto"
            titleClassName="text-white"
            subtitleClassName="text-white/80"
            gridClassName="gap-y-12"
          />
        </section>
      </div>

      {/* Services Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                I Nostri Servizi
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
                Servizi per ottenere un prodotto perfetto.
              </p>
            </div>
            <Services />
          </div>
        </section>
      </div>

      {/* Products Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                I Nostri Prodotti
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
                Scopri la nostra collezione di prodotti personalizzati in ceramica.
              </p>
            </div>
            <Products />
            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 text-lg font-semibold group"
              >
                Vedi Tutti i Prodotti
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
            </div>
          </div>
        </section>
      </div>

      {/* Social Media Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Seguici sui Social
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
                Resta sempre aggiornato sui nostri progetti, novità e contenuti esclusivi.
              </p>
            </div>
            <div className="flex justify-center space-x-8">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/lemsolutionsmonza"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur/30 hover:bg-white/30 flex h-20 w-20 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
                title="Seguici su Facebook"
              >
                <svg
                  width="40"
                  height="40"
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
                className="bg-white/20 backdrop-blur/30 hover:bg-white/30 flex h-20 w-20 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
                title="Seguici su Instagram"
              >
                <svg
                  width="40"
                  height="40"
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
                className="bg-white/20 backdrop-blur/30 hover:bg-white/30 flex h-20 w-20 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
                title="Seguici su LinkedIn"
              >
                <svg
                  width="40"
                  height="40"
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
                className="bg-white/20 backdrop-blur/30 hover:bg-white/30 flex h-20 w-20 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
                title="Seguici su YouTube"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>


      {/* Testimonials Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Cosa Dicono i Nostri Clienti
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
                Le testimonianze dei nostri clienti soddisfatti che hanno scelto di lavorare con noi.
              </p>
            </div>
            <Testimonials />
          </div>
        </section>
      </div>

      {/* Blog Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Il Nostro Blog
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
              Scopri il mondo della stampa digitale su ceramica
              </p>
            </div>
            <Blog />
          </div>
        </section>
      </div>

      {/* Contact Section */}
      <div className="text-white">
        <div id="preventivo" className="relative -top-24 h-0" aria-hidden="true" />
        <div id="consulenza" className="relative -top-24 h-0" aria-hidden="true" />
        <section id="contatti" className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Contattaci
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
                Dal 1998 sviluppiamo soluzioni di fotoceramica professionale: consulenza dedicata, produzione certificata e assistenza rapida per portare sul mercato collezioni ceramiche personalizzate, targhe memoriali e superfici decorative ad alto impatto.
              </p>
            </div>
            <Contact />
          </div>
        </section>
      </div>

      {/* Novità Pop-up Modal */}
      <NovitaPopup />
    </>
  );
};

export default HomePage;

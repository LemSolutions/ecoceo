"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { getImageUrl } from '@/sanity/lib/image';
import { safeFetch } from '@/sanity/lib/client';
import { navbarServicesQuery } from '@/sanity/lib/queries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons/faShoppingBag';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons/faBriefcase';
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons/faNewspaper';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons/faChartColumn';
import { useCart } from '@/contexts/CartContext';

interface HeaderProps {
  siteSettings?: any;
}

const Header = ({ siteSettings }: HeaderProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isCheckoutMaintenanceOpen, setIsCheckoutMaintenanceOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const servicesFetchedRef = useRef(false);
  const { state: cartState, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsSticky(y > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Blocca lo scroll quando il drawer del carrello è aperto
  useEffect(() => {
    if (isMobileCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileCartOpen]);

  useEffect(() => {
    if (servicesFetchedRef.current) return;

    const fetchServices = async () => {
      servicesFetchedRef.current = true;
      try {
        const servicesData = await safeFetch(navbarServicesQuery);
        if (!servicesData || servicesData.length === 0) {
          setServices([
            { _id: 'fallback-1', name: 'Web Design', slug: { current: 'web-design' } },
            { _id: 'fallback-2', name: 'Sviluppo Web', slug: { current: 'sviluppo-web' } },
            { _id: 'fallback-3', name: 'E-commerce', slug: { current: 'e-commerce' } },
            { _id: 'fallback-4', name: 'Consulenza IT', slug: { current: 'consulenza-it' } },
          ]);
        } else {
          setServices(servicesData);
        }
      } catch (error) {
        setServices([
          { _id: 'fallback-1', name: 'Web Design', slug: { current: 'web-design' } },
          { _id: 'fallback-2', name: 'Sviluppo Web', slug: { current: 'sviluppo-web' } },
          { _id: 'fallback-3', name: 'E-commerce', slug: { current: 'e-commerce' } },
          { _id: 'fallback-4', name: 'Consulenza IT', slug: { current: 'consulenza-it' } },
        ]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Funzione per chiudere il menu mobile quando si clicca su un link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setIsMobileCartOpen(false);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) {
      e.preventDefault();
      setIsMobileCartOpen(!isMobileCartOpen);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <>
      <header
        className={`header top-0 left-0 z-20 flex w-full items-center ${
          isSticky ? "!fixed !z-[9999] shadow-sticky backdrop-blur-sm !transition text-white" : "absolute bg-transparent text-black"
        }`}
        style={{
          fontFamily: siteSettings?.typography?.headingFont || 'Inter',
          ...(isSticky && {
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          })
        }}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link href="/" className="header-logo block w-full py-1 group">
                {siteSettings?.logo && (
                  <Image
                    src={getImageUrl(siteSettings.logo)}
                    alt="logo"
                    width={150}
                    height={35}
                    className="w-full dark:hidden transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
                  />
                )}
                {siteSettings?.logoDark && (
                  <Image
                    src={getImageUrl(siteSettings.logoDark)}
                    alt="logo"
                    width={150}
                    height={35}
                    className="hidden w-full dark:block transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
                  />
                )}
                {!siteSettings?.logo && !siteSettings?.logoDark && (
                  <div className="w-[150px] h-[35px] bg-primary rounded flex items-center justify-center">
                    <span className="text-white font-bold text-lg">LOGO</span>
                  </div>
                )}
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  id="navbarToggler"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Chiudi menu Navigazione" : "Apri menu Navigazione"}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="navbarCollapse"
                >
                  <span className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${isSticky ? 'bg-black' : 'bg-black dark:bg-white'}`}></span>
                  <span className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${isSticky ? 'bg-black' : 'bg-black dark:bg-white'}`}></span>
                  <span className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${isSticky ? 'bg-black' : 'bg-black dark:bg-white'}`}></span>
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[280px] rounded-lg border-[.5px] bg-white/20 backdrop-blur-xl px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    isMobileMenuOpen ? "visible top-full opacity-100" : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-4 space-y-3 lg:space-y-0 lg:items-center">
                    <li className="group relative flex justify-end lg:justify-start">
                      <Link
                        href="/"
                        onClick={handleLinkClick}
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 h-7 md:h-8 w-auto shadow-lg"
                      >
                        Home
                        <FontAwesomeIcon icon={faHome} className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                    <li className="group relative z-50 flex justify-end lg:justify-start">
                      <div className="relative">
                        <button
                          className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 h-7 md:h-8 w-auto shadow-lg min-w-[110px]"
                          onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                          onMouseEnter={() => setIsServicesDropdownOpen(true)}
                          onMouseLeave={() => setIsServicesDropdownOpen(false)}
                          disabled={servicesLoading}
                          aria-label={isServicesDropdownOpen ? "Chiudi menu servizi" : "Apri menu servizi"}
                        >
                          Servizi
                          <FontAwesomeIcon icon={faChevronDown} className="ml-1 h-4 w-4 transition-transform duration-200" />
                        </button>
                        {/* Dropdown Menu */}
                        <div
                          className={`absolute right-0 lg:left-0 mt-2 w-64 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-200 lg:block z-[100] ${
                            isServicesDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
                          }`}
                          onMouseEnter={() => setIsServicesDropdownOpen(true)}
                          onMouseLeave={() => setIsServicesDropdownOpen(false)}
                          style={{ backgroundColor: '#ffffff' }}
                        >
                          <div className="py-1">
                            <Link
                              href="/services"
                              onClick={handleLinkClick}
                              className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150 border-b border-gray-200 text-right lg:text-left"
                              style={{ color: '#1f2937' }}
                            >
                              <div className="font-medium" style={{ color: '#111827' }}>Tutti i Servizi</div>
                            </Link>
                            {services.length > 0 ? (
                              services.map((service, index) => (
                                <Link
                                  key={service._id || index}
                                  href={service.url || `/services/${service.slug?.current}`}
                                  onClick={handleLinkClick}
                                  className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150 text-right lg:text-left"
                                  style={{ color: '#1f2937' }}
                                >
                                  <div className="font-medium" style={{ color: '#111827' }}>{service.name}</div>
                                </Link>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 text-right lg:text-left">
                                Servizi in aggiornamento...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="group relative flex justify-end lg:justify-start">
                      <Link
                        href="/about"
                        onClick={handleLinkClick}
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 h-7 md:h-8 w-auto shadow-lg"
                      >
                        About
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                    {/* Shop link rimosso: il cliente può solo aggiungere prodotti al carrello */}
                    <li className="group relative flex justify-end lg:justify-start">
                      <Link
                        href="/projects"
                        onClick={handleLinkClick}
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 h-7 md:h-8 w-auto shadow-lg"
                      >
                        Progetti
                        <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                    <li className="group relative flex justify-end lg:justify-start">
                      <Link
                        href="/blog"
                        onClick={handleLinkClick}
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 h-7 md:h-8 w-auto shadow-lg"
                      >
                        Blog
                        <FontAwesomeIcon icon={faFileLines} className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                    <li className="group relative flex justify-end lg:justify-start">
                      <Link
                        href="/novita"
                        onClick={handleLinkClick}
                        className="novita-pulse group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur h-7 md:h-8 w-auto shadow-lg"
                      >
                        Novità
                        <FontAwesomeIcon icon={faNewspaper} className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                    <li className="group relative flex justify-end lg:justify-start">
                      <Link
                        href="/contact"
                        onClick={handleLinkClick}
                        className="group px-4 py-3 lg:px-2 lg:md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-sm font-semibold lg:text-xs lg:md:text-sm lg:font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 lg:h-7 lg:md:h-8 w-64 lg:w-auto shadow-lg"
                      >
                        Support
                        <FontAwesomeIcon icon={faComments} className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                    {/* Dashboard button removed */}
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0 gap-4">
                <Link
                  href="/shop/cart"
                  onClick={handleCartClick}
                  className="relative inline-flex items-center justify-center p-2 text-white hover:text-blue-300 transition-colors"
                  aria-label="Carrello"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 640 512" aria-hidden="true">
                    <path d="M24-16C10.7-16 0-5.3 0 8S10.7 32 24 32l45.3 0c3.9 0 7.2 2.8 7.9 6.6l52.1 286.3c6.2 34.2 36 59.1 70.8 59.1L456 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-255.9 0c-11.6 0-21.5-8.3-23.6-19.7l-5.1-28.3 303.6 0c30.8 0 57.2-21.9 62.9-52.2L568.9 69.9C572.6 50.2 557.5 32 537.4 32l-412.7 0-.4-2c-4.8-26.6-28-46-55.1-46L24-16zM208 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm224 0a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"></path>
                  </svg>
                  {cartState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 !text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartState.itemCount > 99 ? '99+' : cartState.itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/area-clienti"
                  className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 h-7 md:h-8 w-auto shadow-lg"
                >
                  Area Clienti
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Cart Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[9998] transition-opacity duration-300 ${
          isMobileCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMobileCartOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div
          className={`absolute right-0 top-28 max-h-[calc(100vh-6rem)] w-[85vw] max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            isMobileCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Carrello</h2>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="p-2 text-gray-600 hover:text-black transition-colors"
                aria-label="Chiudi carrello"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            {cartState.items.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <p className="text-gray-600 text-lg">Il tuo carrello è vuoto</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartState.items.map((item) => {
                    const productPrice = item.product.price.unit_amount / 100;
                    const productImage = item.product.images && item.product.images.length > 0 
                      ? item.product.images[0] 
                      : '/images/blog/blog-01.jpg';
                    const productName = item.product.name || 'Prodotto senza nome';
                    
                    return (
                      <div key={item.product.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0 relative w-20 h-20">
                          <Image
                            src={productImage}
                            alt={productName}
                            fill
                            className="object-cover rounded-lg"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-black truncate">{productName}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatPrice(productPrice)} cad.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="ml-auto text-red-600 hover:text-red-800 text-sm"
                            >
                              Rimuovi
                            </button>
                          </div>
                          <p className="text-lg font-bold text-primary mt-2">
                            {formatPrice(productPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-black">Totale:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(cartState.total)}
                    </span>
                  </div>
                  <Link
                    href="/shop/cart"
                    onClick={handleLinkClick}
                    className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-full transition-all mb-3"
                  >
                    Vai al Carrello
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutMaintenanceOpen(true)}
                    className="block w-full text-center bg-white text-primary font-semibold py-3 px-6 rounded-full border border-primary hover:bg-gray-100 transition-all"
                  >
                    Vai al Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Maintenance Modal */}
      {isCheckoutMaintenanceOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Checkout in manutenzione"
          onClick={() => setIsCheckoutMaintenanceOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900">Checkout momentaneamente non disponibile</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Al momento il checkout è in fase di manutenzione per migliorare la sicurezza e l’esperienza di acquisto.
              Puoi comunque aggiungere prodotti al carrello e tornare più tardi a completare l’ordine.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="w-full rounded-xl bg-gray-900 text-white py-2.5 font-semibold hover:bg-gray-800 transition"
                onClick={() => setIsCheckoutMaintenanceOpen(false)}
              >
                Ok, ho capito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

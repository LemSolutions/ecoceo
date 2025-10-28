"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getImageUrl } from '@/sanity/lib/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faShoppingBag, 
  faBriefcase, 
  faFileText, 
  faComments,
  faChevronDown,
  faArrowRight,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';

import { safeFetch } from '@/sanity/lib/client';
import { navbarServicesQuery } from '@/sanity/lib/queries';
import MiniCart from '@/components/Shop/MiniCart';

interface HeaderProps {
  siteSettings?: any;
}

const Header = ({ siteSettings }: HeaderProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await safeFetch(navbarServicesQuery);
        console.log('Services fetched:', servicesData);
        
        // If no services from Sanity, use fallback services
        if (!servicesData || servicesData.length === 0) {
          console.log('No services from Sanity, using fallback');
          setServices([
            { _id: 'fallback-1', name: 'Web Design', slug: { current: 'web-design' } },
            { _id: 'fallback-2', name: 'Sviluppo Web', slug: { current: 'sviluppo-web' } },
            { _id: 'fallback-3', name: 'E-commerce', slug: { current: 'e-commerce' } },
            { _id: 'fallback-4', name: 'Consulenza IT', slug: { current: 'consulenza-it' } }
          ]);
        } else {
          setServices(servicesData);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Use fallback services on error
        setServices([
          { _id: 'fallback-1', name: 'Web Design', slug: { current: 'web-design' } },
          { _id: 'fallback-2', name: 'Sviluppo Web', slug: { current: 'sviluppo-web' } },
          { _id: 'fallback-3', name: 'E-commerce', slug: { current: 'e-commerce' } },
          { _id: 'fallback-4', name: 'Consulenza IT', slug: { current: 'consulenza-it' } }
        ]);
      }
    };

    fetchServices();
  }, []);



  return (
    <>
      <header
        className={`header top-0 left-0 z-20 flex w-full items-center ${
          isSticky ? "!fixed !z-[9999] shadow-sticky backdrop-blur-sm !transition text-white" : "absolute bg-transparent text-black"
        }`}
        style={{
          fontFamily: siteSettings?.typography?.headingFont || 'Inter',
          ...(isSticky && {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
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
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white/30 backdrop-blur/30 backdrop-blur"></span>
                  <span className="relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white/30 backdrop-blur/30 backdrop-blur"></span>
                  <span className="relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white/30 backdrop-blur/30 backdrop-blur"></span>
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[280px] rounded-lg border-[.5px] bg-white/30 px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    isMobileMenuOpen ? "visible top-full opacity-100" : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-4">
                    <li className="group relative">
                      <Link
                        href="/"
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur h-7 md:h-8 w-auto shadow-lg"
                      >
                        Home
                        <FontAwesomeIcon 
                          icon={faHome} 
                          className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" 
                        />
                      </Link>
                    </li>
                    {services.length > 0 && (
                      <li className="group relative">
                        <div className="relative">
                          <button
                            className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur h-7 md:h-8 w-auto shadow-lg"
                            onMouseEnter={() => setIsServicesDropdownOpen(true)}
                            onMouseLeave={() => setIsServicesDropdownOpen(false)}
                          >
                            Servizi
                            <FontAwesomeIcon 
                              icon={faChevronDown} 
                              className="ml-1 h-4 w-4 transition-transform duration-200" 
                            />
                          </button>
                          {/* Dropdown Menu */}
                          <div
                            className={`absolute left-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 lg:block ${
                              isServicesDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
                            }`}
                            onMouseEnter={() => setIsServicesDropdownOpen(true)}
                            onMouseLeave={() => setIsServicesDropdownOpen(false)}
                            style={{ backgroundColor: '#ffffff' }}
                          >
                            <div className="py-1">
                              <Link
                                href="/services"
                                className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150 border-b border-gray-200"
                                style={{ color: '#1f2937' }}
                              >
                                <div className="font-medium" style={{ color: '#111827' }}>Tutti i Servizi</div>
                              </Link>
                              {services.map((service, index) => (
                                <Link
                                  key={service._id || index}
                                  href={service.url || `/services/${service.slug?.current}`}
                                  className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150"
                                  style={{ color: '#1f2937' }}
                                >
                                  <div className="font-medium" style={{ color: '#111827' }}>{service.name}</div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </li>
                    )}
                    <li className="group relative">
                      <Link
                        href="/about"
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur h-7 md:h-8 w-auto shadow-lg"
                      >
                        About
                        <FontAwesomeIcon 
                          icon={faUser} 
                          className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" 
                        />
                      </Link>
                    </li>
                    <li className="group relative">
                      <Link
                        href="/shop"
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur h-7 md:h-8 w-auto shadow-lg"
                      >
                        Shop
                        <FontAwesomeIcon 
                          icon={faShoppingBag} 
                          className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" 
                        />
                      </Link>
                    </li>
                    <li className="group relative">
                      <Link
                        href="/projects"
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur h-7 md:h-8 w-auto shadow-lg"
                      >
                        Progetti
                        <FontAwesomeIcon 
                          icon={faBriefcase} 
                          className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" 
                        />
                      </Link>
                    </li>
                    <li className="group relative">
                      <Link
                        href="/blog"
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur h-7 md:h-8 w-auto shadow-lg"
                      >
                        Blog
                        <FontAwesomeIcon 
                          icon={faFileText} 
                          className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" 
                        />
                      </Link>
                    </li>
                    <li className="group relative">
                      <Link
                        href="/contact"
                        className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border border-blue-400/30 backdrop-blur h-7 md:h-8 w-auto shadow-lg"
                      >
                        Support
                        <FontAwesomeIcon 
                          icon={faComments} 
                          className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" 
                        />
                      </Link>
                    </li>
                    {/* Dashboard button removed */}
                  </ul>
                  
                  {/* Mobile CTA Buttons */}
                  <div className="mt-6 lg:hidden space-y-3">
                    <Link
                      href="/dashboard"
                      className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 h-7 md:h-8 w-full shadow-lg"
                    >
                      Dashboard
                      <FontAwesomeIcon 
                        icon={faChartBar} 
                        className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" 
                      />
                    </Link>
                    <Link
                      href="/area-clienti"
                      className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 h-7 md:h-8 w-full shadow-lg"
                    >
                      Area Clienti
                      <FontAwesomeIcon 
                        icon={faArrowRight} 
                        className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" 
                      />
                    </Link>
                  </div>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0 gap-4">
                <MiniCart />
                <Link
                  href="/area-clienti"
                  className="group px-2 md:px-3 inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 h-7 md:h-8 w-auto shadow-lg"
                >
                  Area Clienti
                  <FontAwesomeIcon 
                    icon={faArrowRight} 
                    className="w-4 h-4 transition duration-300 group-hover:translate-x-0.5" 
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

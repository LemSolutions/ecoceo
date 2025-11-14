"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { safeFetch } from '@/sanity/lib/client';
import { novitaQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';

// Estendi Window interface per Iubenda
declare global {
  interface Window {
    _iub?: any;
  }
}

const STORAGE_KEY = 'novita_popup_seen';

// Funzione di utilità per resettare il popup (per testing)
// Chiama: window.resetNovitaPopup() nella console del browser
if (typeof window !== 'undefined') {
  (window as any).resetNovitaPopup = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ NovitaPopup: localStorage resettato. Ricarica la pagina per vedere il popup.');
  };
}

interface NovitaPopupProps {
  onClose?: () => void;
}

const NovitaPopup: React.FC<NovitaPopupProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [allNovita, setAllNovita] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verifica se il pop-up è già stato visto
  const hasSeenPopup = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return false;
    }
  };

  // Verifica se il browser è Chrome
  const isChrome = (): boolean => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent;
    return /Chrome/.test(userAgent) && !/Edg|OPR|Brave/.test(userAgent);
  };

  // Verifica se Iubenda cookie banner è stato gestito
  // Iubenda salva il consenso in _iub_cs-* cookie o localStorage
  const hasIubendaConsent = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      // Verifica se esiste un cookie di consenso Iubenda
      const cookies = document.cookie.split(';');
      const hasIubendaCookie = cookies.some(cookie => 
        cookie.trim().startsWith('_iub_cs-') || 
        cookie.trim().startsWith('euconsent-v2')
      );
      
      // Verifica anche in localStorage (Iubenda può usare entrambi)
      const iubendaStorage = localStorage.getItem('_iub_cs-43054480') || 
                           localStorage.getItem('iubenda_consent');
      
      // Se Iubenda non è ancora caricato o non ha mostrato il banner, aspetta
      // Controlla se lo script Iubenda è presente
      const iubendaScriptLoaded = typeof window._iub !== 'undefined' || 
                                  document.querySelector('script[src*="iubenda"]');
      
      // Se Iubenda è configurato ma non abbiamo ancora il consenso, aspetta
      if (iubendaScriptLoaded && !hasIubendaCookie && !iubendaStorage) {
        return false;
      }
      
      // Se non c'è Iubenda o abbiamo già il consenso, procedi
      return true;
    } catch (error) {
      console.error('Error checking Iubenda consent:', error);
      return true; // In caso di errore, procedi comunque
    }
  };

  // Salva che il pop-up è stato visto
  const markAsSeen = (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Fetch di tutte le novità attive
  useEffect(() => {
    const fetchAllNovita = async () => {
      try {
        console.log('📡 NovitaPopup: Fetching tutte le novità...');
        const novitaData = await safeFetch(novitaQuery);
        console.log('📡 NovitaPopup: Dati ricevuti:', novitaData);
        setAllNovita(novitaData || []);
      } catch (error) {
        console.error('❌ NovitaPopup: Error fetching novità:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNovita();
  }, []);


  // Logica di apertura automatica
  useEffect(() => {
    if (loading) {
      console.log('🔍 NovitaPopup: Loading...');
      return;
    }

    if (!allNovita || allNovita.length === 0) {
      console.log('⚠️ NovitaPopup: Nessuna novità trovata');
      return;
    }

    console.log('🔍 NovitaPopup: Verifica condizioni apertura');
    console.log('  - hasSeenPopup:', hasSeenPopup());
    console.log('  - isChrome:', isChrome());
    console.log('  - novità trovate:', allNovita.length);
    console.log('  - hasIubendaConsent:', hasIubendaConsent());

    // Verifica le condizioni per l'apertura:
    // 1. Non deve essere già stato visto
    // 2. Deve essere Chrome
    // 3. Deve esserci almeno una novità disponibile
    // 4. Iubenda cookie banner deve essere stato gestito (se presente)
    if (!hasSeenPopup() && isChrome() && allNovita.length > 0 && hasIubendaConsent()) {
      console.log('✅ NovitaPopup: Tutte le condizioni soddisfatte, apertura in 2 secondi...');
      // Delay maggiore per assicurarsi che:
      // - La pagina sia completamente caricata
      // - Il cookie banner di Iubenda (se presente) sia stato gestito
      // - Non ci siano conflitti di z-index
      const timer = setTimeout(() => {
        console.log('🎉 NovitaPopup: Apertura popup!');
        setIsOpen(true);
      }, 2000); // Delay aumentato a 2 secondi per rispettare Iubenda

      return () => clearTimeout(timer);
    } else {
      console.log('❌ NovitaPopup: Condizioni non soddisfatte');
    }
  }, [loading, allNovita]);

  // Monitora il consenso Iubenda se non è ancora disponibile
  useEffect(() => {
    if (loading || !allNovita || allNovita.length === 0 || hasSeenPopup() || !isChrome()) {
      if (!isChrome()) {
        console.log('❌ NovitaPopup: Browser non è Chrome');
      }
      return;
    }
    
    // Se Iubenda è presente ma non abbiamo ancora il consenso, aspetta
    if (!hasIubendaConsent()) {
      console.log('⏳ NovitaPopup: In attesa del consenso Iubenda...');
      // Controlla periodicamente se il consenso è stato dato
      const checkInterval = setInterval(() => {
        if (hasIubendaConsent() && !hasSeenPopup()) {
          console.log('✅ NovitaPopup: Consenso Iubenda ricevuto, apertura popup!');
          setIsOpen(true);
          clearInterval(checkInterval);
        }
      }, 1000);

      // Timeout di sicurezza: dopo 10 secondi, mostra comunque il pop-up
      const timeout = setTimeout(() => {
        console.log('⏰ NovitaPopup: Timeout raggiunto, apertura forzata');
        clearInterval(checkInterval);
        if (!hasSeenPopup()) {
          setIsOpen(true);
        }
      }, 10000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, [loading, allNovita]);

  // Gestione chiusura
  const handleClose = (): void => {
    setIsOpen(false);
    markAsSeen();
    if (onClose) {
      onClose();
    }
  };

  // Gestione click su "Richiedi Preventivo" o "Maggiori Info"
  const handleActionClick = (): void => {
    markAsSeen();
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Non renderizzare se non è aperto o non ci sono novità
  if (!isOpen || allNovita.length === 0) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9997] transition-opacity"
        onClick={handleClose}
      />

      {/* Pop-up Modal */}
      {/* Z-index 9998 per essere sopra tutto tranne Iubenda cookie banner (che usa z-index molto alto) */}
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] pointer-events-auto transform transition-all flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Novità
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Chiudi"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allNovita.map((novita, index) => (
                <div
                  key={novita._id || index}
                  className="bg-white/50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image */}
                  {novita.mainImage && (
                    <Link
                      href={`/novita/${novita.slug?.current || novita._id}`}
                      onClick={handleActionClick}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getImageUrl(novita.mainImage)}
                          alt={getTextValue(novita.title)}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                    </Link>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <Link
                      href={`/novita/${novita.slug?.current || novita._id}`}
                      onClick={handleActionClick}
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-orange-500 transition-colors line-clamp-2">
                        {getTextValue(novita.title)}
                      </h3>
                    </Link>

                    {/* Subtitle */}
                    {novita.subtitle && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                        {getTextValue(novita.subtitle)}
                      </p>
                    )}

                    {/* Mini Intro */}
                    {novita.miniIntro && (
                      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                        {getTextValue(novita.miniIntro)}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/novita/${novita.slug?.current || novita._id}`}
                        onClick={handleActionClick}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-semibold px-4 py-2 rounded-lg text-center transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        Leggi di più
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer con CTA principale */}
          <div className="p-6 border-t border-gray-200 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:commerciale@lemsolutions.it?subject=QUOTE LEM SOLUTIONS CERAMIC SYSTEMS"
                onClick={handleActionClick}
                className="hero-button-flash flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-full text-center transition-all shadow-lg hover:shadow-xl"
              >
                Richiedi Preventivo
              </a>
              <Link
                href="/novita"
                onClick={handleActionClick}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-lg text-center transition-colors"
              >
                Vedi tutte le Novità
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NovitaPopup;


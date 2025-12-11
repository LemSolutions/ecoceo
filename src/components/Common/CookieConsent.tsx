"use client";

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    _iub?: any;
    _iub_cs?: any;
  }
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isIubendaLoaded, setIsIubendaLoaded] = useState(false);

  useEffect(() => {
    // Verifica se il consenso è già stato dato
    const checkConsent = () => {
      try {
        // Controlla se esiste un cookie di consenso iubenda
        const cookies = document.cookie.split(';');
        const hasConsentCookie = cookies.some(cookie => 
          cookie.trim().startsWith('_iub_cs-') || 
          cookie.trim().startsWith('euconsent-v2')
        );

        // Controlla anche localStorage
        const hasLocalStorageConsent = 
          localStorage.getItem('_iub_cs-43054480') || 
          localStorage.getItem('iubenda_consent');

        // Se non c'è consenso, mostra il banner
        if (!hasConsentCookie && !hasLocalStorageConsent) {
          setShowBanner(true);
        } else {
          setShowBanner(false);
        }

        // Verifica se iubenda è caricato
        if (typeof window._iub !== 'undefined') {
          setIsIubendaLoaded(true);
          
          // Aggiungi listener per i callback di iubenda
          if (window._iub.cs && window._iub.cs.api) {
            // Nascondi il banner quando viene dato il consenso tramite iubenda
            window._iub.cs.api.addEventListener('consentGiven', () => {
              setShowBanner(false);
            });
          }
        } else {
          // Aspetta che iubenda si carichi
          const checkIubenda = setInterval(() => {
            if (typeof window._iub !== 'undefined') {
              setIsIubendaLoaded(true);
              clearInterval(checkIubenda);
              
              // Aggiungi listener dopo il caricamento
              if (window._iub.cs && window._iub.cs.api) {
                window._iub.cs.api.addEventListener('consentGiven', () => {
                  setShowBanner(false);
                });
              }
            }
          }, 100);

          // Timeout dopo 5 secondi
          setTimeout(() => {
            clearInterval(checkIubenda);
            setIsIubendaLoaded(true); // Procedi comunque
          }, 5000);
        }
      } catch (error) {
        console.error('Error checking consent:', error);
        setShowBanner(true); // Mostra il banner in caso di errore
      }
    };

    // Aspetta che il DOM sia pronto
    if (typeof window !== 'undefined') {
      setTimeout(checkConsent, 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      if (typeof window._iub !== 'undefined' && window._iub.cs && window._iub.cs.api) {
        // Usa l'API di iubenda per accettare tutti i cookie
        window._iub.cs.api.acceptAll();
        setShowBanner(false);
      } else {
        // Fallback: imposta manualmente il consenso
        localStorage.setItem('_iub_cs-43054480', 'true');
        localStorage.setItem('iubenda_consent', 'true');
        document.cookie = '_iub_cs-43054480=true; path=/; max-age=31536000; SameSite=Lax';
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error accepting cookies:', error);
      // Fallback in caso di errore
      localStorage.setItem('_iub_cs-43054480', 'true');
      document.cookie = '_iub_cs-43054480=true; path=/; max-age=31536000; SameSite=Lax';
      setShowBanner(false);
    }
  };

  const handleRejectAll = () => {
    try {
      if (typeof window._iub !== 'undefined' && window._iub.cs && window._iub.cs.api) {
        // Usa l'API di iubenda per rifiutare tutti i cookie
        window._iub.cs.api.rejectAll();
        setShowBanner(false);
      } else {
        // Fallback: imposta manualmente il rifiuto
        localStorage.setItem('_iub_cs-43054480', 'false');
        localStorage.setItem('iubenda_consent', 'false');
        document.cookie = '_iub_cs-43054480=false; path=/; max-age=31536000; SameSite=Lax';
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error rejecting cookies:', error);
      // Fallback in caso di errore
      localStorage.setItem('_iub_cs-43054480', 'false');
      document.cookie = '_iub_cs-43054480=false; path=/; max-age=31536000; SameSite=Lax';
      setShowBanner(false);
    }
  };

  const handleOpenSettings = () => {
    try {
      if (typeof window._iub !== 'undefined' && window._iub.cs && window._iub.cs.api) {
        // Apri le impostazioni cookie di iubenda
        window._iub.cs.api.openPreferences();
      } else {
        // Fallback: scrolla al footer dove c'è il link
        const footer = document.querySelector('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Error opening settings:', error);
      // Fallback: scrolla al footer
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg border-t border-blue-400/30 backdrop-blur"
      style={{ 
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 text-sm leading-relaxed">
            <p className="text-white">
              Questo sito utilizza cookie, anche di terze parti o tecnologie simili per scopi tecnici e, previo tuo consenso, per altri finalità come specificato nella{' '}
              <a 
                href="https://www.iubenda.com/privacy-policy/43054480/cookie-policy" 
                className="iubenda-black iubenda-noiframe iubenda-embed iubenda-noiframe text-blue-100 hover:text-white underline font-medium"
                title="Cookie Policy"
              >
                Cookie Policy
              </a>
              . Puoi acconsentire all'uso di tali tecnologie utilizzando il pulsante "Accetta tutti" o negare e chiudere l'avviso utilizzando il pulsante "Rifiuta tutti". Puoi liberamente dare, negare o revocare il tuo consenso in qualsiasi momento cliccando su "Consenso Cookie" in fondo alla pagina.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={handleRejectAll}
              className="px-6 py-2 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-md transition duration-300 font-medium text-sm whitespace-nowrap shadow-md"
            >
              Rifiuta tutti
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:brightness-110 text-white rounded-md transition duration-300 font-medium text-sm whitespace-nowrap shadow-md shadow-orange-500/40"
            >
              Accetta tutti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente per il link "Consenso Cookie" nel footer
export const CookieConsentLink = () => {
  const handleOpenSettings = () => {
    try {
      if (typeof window._iub !== 'undefined' && window._iub.cs && window._iub.cs.api) {
        // Apri le impostazioni cookie di iubenda
        window._iub.cs.api.openPreferences();
      } else {
        // Fallback: scrolla al footer
        const footer = document.querySelector('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Error opening cookie settings:', error);
      // Fallback: scrolla al footer
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <button
      onClick={handleOpenSettings}
      className="text-white hover:text-orange-300 text-sm transition duration-300 cursor-pointer underline"
    >
      Consenso Cookie
    </button>
  );
};

export default CookieConsent;


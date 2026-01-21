"use client";

import { useEffect, useState, useRef } from 'react';

interface FullPageRecompositionProps {
  isActive: boolean;
}

const FullPageRecomposition = ({ isActive }: FullPageRecompositionProps) => {
  const [phase, setPhase] = useState<'idle' | 'empty' | 'recomposing'>('idle');
  const elementsRef = useRef<Array<{ element: HTMLElement; originalOpacity: string }>>([]);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Solo quando isActive diventa true, siamo in idle e non stiamo già processando
    if (isActive && phase === 'idle' && !isProcessingRef.current) {
      isProcessingRef.current = true;
      // Fase vuota - nascondi tutto il contenuto mantenendo lo sfondo
      setPhase('empty');
      
      // Trova e nascondi solo gli elementi della sezione novità
      const hideElements = () => {
        elementsRef.current = [];
        
        // Seleziona solo elementi dentro #novita-section
        const novitaSection = document.querySelector('#novita-section');
        if (!novitaSection) return;
        
        // Seleziona solo gli elementi principali per evitare duplicati
        const mainElements = novitaSection.querySelectorAll('article, .container > div, h2, h3, p, a, button, img');
        const uniqueElements = new Set<HTMLElement>();
        
        mainElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          // Evita duplicati e elementi già processati
          if (!uniqueElements.has(htmlEl) && htmlEl.offsetParent !== null) {
            uniqueElements.add(htmlEl);
            
            // Salva lo stato originale
            elementsRef.current.push({
              element: htmlEl,
              originalOpacity: htmlEl.style.opacity || ''
            });
            
            // Nascondi immediatamente senza transizione per evitare doppio movimento
            htmlEl.style.transition = 'none'; // Forza nessuna transizione
            htmlEl.style.opacity = '0';
            htmlEl.style.pointerEvents = 'none';
            // Forza il reflow per applicare immediatamente
            void htmlEl.offsetHeight;
          }
        });
      };
      
      hideElements();
      
      // Inizia la ricomposizione dopo un breve delay
      setTimeout(() => {
        setPhase('recomposing');
        
        // Ricompone gli elementi uno alla volta semplicemente
        const recomposeElements = () => {
          const visibleElements = elementsRef.current.filter(({ element }) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
          
          // Apparizione con pulsazione tipo cuore - tutti insieme
          visibleElements.forEach(({ element }) => {
            // Imposta opacity a 1 e pointer events PRIMA di tutto
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
            // Rimuovi transizioni per evitare conflitti
            element.style.transition = 'none';
            // Imposta stato iniziale per animazione
            element.style.transform = 'scale(0.95)';
            // Forza reflow per applicare gli stili
            void element.offsetHeight;
            // Applica animazione heartbeat (solo scale, opacity sempre 1)
            element.classList.add('heartbeat-pulse');
          });
          
          // Completa dopo l'animazione heartbeat (circa 1.5s per 3 battiti)
          const totalDuration = 1.8; // Tempo per 2-3 pulsazioni
          setTimeout(() => {
            setPhase('idle');
            isProcessingRef.current = false; // Permetti nuovo click
            // Reset: rimuovi tutti gli stili inline e classi per permettere nuovo click
            elementsRef.current.forEach(({ element }) => {
              element.classList.remove('heartbeat-pulse');
              element.style.opacity = '';
              element.style.pointerEvents = '';
              element.style.transition = '';
              element.style.transform = '';
            });
            elementsRef.current = [];
          }, totalDuration * 1000);
        };
        
        recomposeElements();
      }, 100);
    } else if (!isActive && phase !== 'idle') {
      // Reset quando non è attivo - ripristina tutto
      isProcessingRef.current = false;
      elementsRef.current.forEach(({ element }) => {
        element.classList.remove('heartbeat-pulse');
        element.style.opacity = '';
        element.style.pointerEvents = '';
        element.style.transition = '';
        element.style.transform = '';
      });
      elementsRef.current = [];
      setPhase('idle');
    }
  }, [isActive, phase]);

  return (
    <>
      <style jsx global>{`
        /* Animazione pulsazione tipo cuore - 2-3 battiti */
        .heartbeat-pulse {
          animation: heartbeatPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }
        
        @keyframes heartbeatPulse {
          0% {
            transform: scale(0.95);
          }
          20% {
            transform: scale(1.08);
          }
          35% {
            transform: scale(0.98);
          }
          50% {
            transform: scale(1.05);
          }
          65% {
            transform: scale(1);
          }
          80% {
            transform: scale(1.03);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default FullPageRecomposition;

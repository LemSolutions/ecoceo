"use client";

import { useEffect, useState } from 'react';

interface CeramicTunnelTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  targetSelector: string;
  onEmptySite?: () => void;
  onRecompose?: () => void;
}

const CeramicTunnelTransition = ({ isActive, onComplete, targetSelector, onEmptySite, onRecompose }: CeramicTunnelTransitionProps) => {
  const [phase, setPhase] = useState<'idle' | 'entering' | 'tunnel' | 'exiting' | 'empty'>('idle');

  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('entering');
      
      // Fase tunnel - più veloce
      setTimeout(() => {
        setPhase('tunnel');
      }, 150);

      // Svuota il sito dopo il tunnel - molto più veloce
      setTimeout(() => {
        setPhase('exiting');
        onEmptySite?.();
        
        // Scroll alla sezione centrata nello schermo
        setTimeout(() => {
          const targetElement = document.querySelector(targetSelector);
          if (targetElement) {
            // Calcola il centro della viewport
            const viewportHeight = window.innerHeight;
            const elementRect = targetElement.getBoundingClientRect();
            const elementHeight = elementRect.height;
            const currentScrollY = window.scrollY;
            
            // Calcola la posizione per centrare l'elemento nello schermo
            const elementTop = elementRect.top + currentScrollY;
            const centerOffset = (viewportHeight / 2) - (elementHeight / 2);
            const targetScrollY = elementTop - centerOffset;
            
            // Scroll smooth al centro
            window.scrollTo({
              top: Math.max(0, targetScrollY),
              behavior: 'smooth'
            });
          }
        }, 50);
        
        // Fase vuota - immediata
        setTimeout(() => {
          setPhase('empty');
        }, 50);
        
        // Inizia la ricomposizione immediatamente
        setTimeout(() => {
          onRecompose?.();
        }, 100);
        
        // Completa la transizione tunnel più velocemente
        setTimeout(() => {
          onComplete();
          setPhase('idle');
        }, 1200);
      }, 1000);
    }
  }, [isActive, phase, targetSelector, onComplete, onEmptySite, onRecompose]);

  if (!isActive && phase === 'idle') return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] pointer-events-none ${
        phase === 'entering' || phase === 'tunnel' || phase === 'exiting' ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-200`}
      style={{
        willChange: phase === 'tunnel' ? 'opacity' : 'auto',
        transform: 'translateZ(0)',
        perspective: '1000px',
      }}
    >
      {/* Tunnel ceramico circolare - elegante e pulito */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: phase === 'tunnel' 
            ? 'radial-gradient(circle at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.9) 70%, rgba(0, 0, 0, 1) 100%)'
            : 'transparent',
          transition: 'background 0.8s ease-out',
        }}
      >
        {/* Anelli concentrici perfetti - effetto tunnel 3D */}
        {Array.from({ length: 8 }).map((_, i) => {
          const delay = i * 0.05;
          const baseSize = 80;
          const size = baseSize - (i * 6);
          const scale = phase === 'tunnel' ? 1 + (i * 0.08) : 1;
          const opacity = phase === 'tunnel' 
            ? Math.max(0.15, 1 - (i * 0.12)) 
            : 0;
          
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                maxWidth: '800px',
                maxHeight: '800px',
                border: `2px solid rgba(250, 240, 230, ${0.4 - i * 0.04})`,
                boxShadow: phase === 'tunnel' 
                  ? `inset 0 0 ${20 + i * 5}px rgba(250, 230, 210, ${0.2 - i * 0.02}), 0 0 ${30 + i * 5}px rgba(200, 170, 140, ${0.15 - i * 0.015})`
                  : 'none',
                opacity: opacity,
                transform: `scale(${scale})`,
                transition: phase === 'tunnel'
                  ? `opacity 0.4s ease-out ${delay}s, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`
                  : 'none',
                willChange: phase === 'tunnel' ? 'opacity, transform' : 'auto',
              }}
            />
          );
        })}

        {/* Luce centrale - punto focale */}
        <div
          className="absolute rounded-full"
          style={{
            width: '60%',
            height: '60%',
            maxWidth: '600px',
            maxHeight: '600px',
            background: phase === 'tunnel' 
              ? 'radial-gradient(circle, rgba(255, 245, 235, 0.95) 0%, rgba(250, 240, 230, 0.8) 20%, rgba(240, 220, 200, 0.5) 40%, rgba(220, 200, 180, 0.2) 60%, transparent 80%)'
              : 'transparent',
            opacity: phase === 'tunnel' ? 1 : 0,
            transform: phase === 'tunnel' 
              ? 'scale(1.5)' 
              : 'scale(1)',
            transition: phase === 'tunnel'
              ? 'opacity 0.5s ease-out, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'opacity 0.3s ease-out',
            filter: 'blur(20px)',
            willChange: phase === 'tunnel' ? 'opacity, transform' : 'auto',
          }}
        />

        {/* Effetto riflesso interno - profondità */}
        <div
          className="absolute rounded-full"
          style={{
            width: '40%',
            height: '40%',
            maxWidth: '400px',
            maxHeight: '400px',
            background: phase === 'tunnel'
              ? 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(250, 240, 230, 0.2) 30%, transparent 70%)'
              : 'transparent',
            opacity: phase === 'tunnel' ? 0.6 : 0,
            transform: phase === 'tunnel'
              ? 'scale(1.2)'
              : 'scale(1)',
            transition: phase === 'tunnel'
              ? 'opacity 0.6s ease-out 0.2s, transform 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
              : 'none',
            filter: 'blur(15px)',
            willChange: phase === 'tunnel' ? 'opacity, transform' : 'auto',
          }}
        />
      </div>
    </div>
  );
};

export default CeramicTunnelTransition;

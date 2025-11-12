'use client';

import { useState, useEffect } from 'react';

export function useClientAnalytics() {
  const [analyticsService, setAnalyticsService] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Importa il servizio analytics solo nel browser
    import('@/services/analyticsService').then(({ AnalyticsService }) => {
      // Usa getInstance direttamente invece del hook per evitare errori di React Hooks
      const service = AnalyticsService.getInstance();
      setAnalyticsService(service);
    });
  }, []);

  return { analyticsService, isClient };
}

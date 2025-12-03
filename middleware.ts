import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paesi bloccati: Africa e Sud Asia (inclusa India)
const africa = [
  'DZ','AO','BJ','BW','BF','BI','CM','CV','CF','TD','KM','CG','CD','DJ',
  'EG','GQ','ER','SZ','ET','GA','GM','GH','GN','GW','CI','KE','LS','LR',
  'LY','MG','MW','ML','MR','MU','MA','MZ','NA','NE','NG','RW','ST','SN',
  'SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW'
];

const southAsia = [
  'AF','BD','BT','IN','IR','MV','NP','PK','LK'
];

const blockedCountries = [...africa, ...southAsia];

export function middleware(req: NextRequest) {
  // Estrai l'IP reale (considera anche proxy headers)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const clientIp = forwardedFor?.split(',')[0]?.trim() || realIp || req.ip || 'unknown';

  // Prova diversi header per la geolocalizzazione (supporta Vercel, Cloudflare, ecc.)
  // Vercel fornisce x-vercel-ip-country anche con dominio esterno collegato
  const vercelCountry = req.headers.get('x-vercel-ip-country');
  const cloudflareCountry = req.headers.get('cf-ipcountry');
  const otherCountry = req.headers.get('x-country-code');
  const geoCountry = req.geo?.country;

  const country = vercelCountry || cloudflareCountry || otherCountry || geoCountry || 'unknown';

  // Normalizza il codice paese a maiuscolo
  const countryCode = country.toUpperCase();

  // Log per debug (solo in sviluppo o per monitoraggio)
  if (process.env.NODE_ENV === 'development' || countryCode === 'IN' || countryCode === 'UNKNOWN') {
    console.log('[Middleware] Country check:', {
      country: countryCode,
      ip: clientIp,
      vercelHeader: vercelCountry,
      cloudflareHeader: cloudflareCountry,
      path: req.nextUrl.pathname,
      headers: {
        'x-vercel-ip-country': vercelCountry,
        'cf-ipcountry': cloudflareCountry,
        'x-forwarded-for': forwardedFor,
        'x-real-ip': realIp,
      }
    });
  }

  // Se il paese è "unknown" e siamo in produzione, potremmo voler permettere l'accesso
  // oppure bloccare per sicurezza. Per ora blocchiamo solo se il paese è nella lista.
  // Se vuoi bloccare anche "unknown", rimuovi questo controllo.
  if (countryCode === 'UNKNOWN') {
    // In caso di paese sconosciuto, permetti l'accesso (puoi cambiare questo comportamento)
    // Se vuoi bloccare anche gli unknown, decommenta la riga sotto:
    // return new NextResponse(JSON.stringify({ error: 'Access denied', message: 'Unable to verify location' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    return NextResponse.next();
  }

  // Blocca l'accesso se il paese è nella lista bloccata
  if (blockedCountries.includes(countryCode)) {
    console.warn(`[Middleware] Access denied for country: ${countryCode} from IP: ${clientIp} - Path: ${req.nextUrl.pathname}`);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Access denied',
        message: 'Access from this location is not permitted'
      }),
      { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }

  return NextResponse.next();
}

// Configura il matcher per eseguire il middleware su tutte le route
// Include anche le API routes pubbliche, ma esclude webhook e file statici
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - webhook routes (possono essere chiamate da servizi esterni)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|api/.*webhook).*)',
  ],
};


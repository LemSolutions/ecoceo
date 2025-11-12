import { 
  Inter, 
  Poppins, 
  Roboto, 
  Open_Sans, 
  Montserrat, 
  Lato 
} from 'next/font/google';

// Mapping dei font disponibili per Sanity
export const fontMap = {
  Inter,
  Poppins,
  Roboto,
  'Open Sans': Open_Sans,
  Montserrat,
  Lato,
} as const;

// Font di default
export const defaultFont = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

// Funzione helper per ottenere il font configurato
export function getFont(fontName?: string) {
  if (!fontName) return defaultFont;
  
  const FontComponent = fontMap[fontName as keyof typeof fontMap];
  if (!FontComponent) return defaultFont;
  
  return FontComponent({
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    variable: `--font-${fontName.toLowerCase().replace(' ', '-')}`,
  });
}

// Preload dei font più comuni per migliorare le performance
export const preloadedFonts = {
  heading: Inter({ 
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    preload: true,
    variable: '--font-heading',
  }),
  body: Inter({ 
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
    preload: true,
    variable: '--font-body',
  }),
};


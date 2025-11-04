# Performance Analysis Guide

Questa guida ti aiuterà ad analizzare le prestazioni del sito utilizzando vari strumenti.

## 🚀 Metodi di Analisi

### 1. PageSpeed Insights API (Integrato - Consigliato)

**PageSpeed Insights API** è integrato direttamente nel progetto e può essere eseguito da terminale:

#### Setup (una volta sola)
1. Ottieni una chiave API da Google Cloud Console
2. Segui la guida: `PAGESPEED_API_SETUP.md`
3. Aggiungi la chiave al file `.env.local`:
   ```
   GOOGLE_PAGESPEED_API_KEY=your_api_key_here
   ```

#### Utilizzo
```bash
# Analizza localhost (mobile)
npm run analyze:pagespeed:local

# Analizza localhost (desktop)
npm run analyze:pagespeed:desktop

# Analizza un sito personalizzato
SITE_URL=https://tuo-sito.com npm run analyze:pagespeed
```

**Vantaggi:**
- ✅ Integrato nel progetto
- ✅ Report HTML e JSON salvati localmente
- ✅ Analisi mobile e desktop
- ✅ Gratuito fino a 25,000 richieste/giorno
- ✅ Metriche Core Web Vitals
- ✅ Suggerimenti di ottimizzazione

### 2. PageSpeed Insights (Online)

**PageSpeed Insights** è lo strumento ufficiale di Google, gratuito e online:

1. Vai su: https://pagespeed.web.dev/
2. Inserisci l'URL del tuo sito (locale o produzione)
3. Clicca su "Analizza"
4. Riceverai un report dettagliato con:
   - Score di Performance (0-100)
   - Metriche Core Web Vitals
   - Suggerimenti per migliorare
   - Screenshot mobile e desktop

**Vantaggi:**
- ✅ Non richiede installazione
- ✅ Usa dati reali di Google
- ✅ Analisi sia mobile che desktop
- ✅ Report completo e dettagliato

### 2. Lighthouse CLI (Locale)

**Lighthouse** può essere eseguito localmente tramite CLI:

#### Installazione
```bash
npm install -g lighthouse
```

#### Utilizzo Base
```bash
# Analizza il sito locale
lighthouse http://localhost:3000

# Analizza con output HTML
lighthouse http://localhost:3000 --output=html --output-path=./report.html

# Analizza solo performance
lighthouse http://localhost:3000 --only-categories=performance

# Apri automaticamente il report
lighthouse http://localhost:3000 --view
```

#### Utilizzo con Script NPM
```bash
# Analizza il sito locale (default)
npm run analyze:performance:local

# Analizza un sito personalizzato
SITE_URL=https://tuo-sito.com npm run analyze:performance

# I report saranno salvati in: performance-reports/
```

### 3. Lighthouse Chrome Extension

Puoi anche usare l'estensione Lighthouse direttamente nel browser:

1. Installa l'estensione "Lighthouse" da Chrome Web Store
2. Apri Chrome DevTools (F12)
3. Vai alla tab "Lighthouse"
4. Seleziona le categorie da analizzare
5. Clicca su "Generate report"

## 📊 Metriche Importanti

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Performance Score
- **90-100**: Eccellente (verde)
- **50-89**: Necessita miglioramenti (arancione)
- **0-49**: Scadente (rosso)

## 🎯 Ottimizzazioni Comuni

### Next.js
- ✅ Usa `next/image` per le immagini
- ✅ Abilita compressione
- ✅ Usa `next/dynamic` per code splitting
- ✅ Ottimizza i font (font-display: swap)

### Immagini
- ✅ Usa formati moderni (WebP, AVIF)
- ✅ Lazy loading delle immagini
- ✅ Ottimizza le dimensioni delle immagini

### CSS/JS
- ✅ Minifica CSS e JavaScript
- ✅ Usa CSS-in-JS ottimizzato
- ✅ Code splitting automatico

### Server
- ✅ Abilita gzip/brotli compression
- ✅ Usa CDN per asset statici
- ✅ Configura caching headers

## 📝 Report Generati

I report generati da Lighthouse CLI saranno salvati in:
```
performance-reports/
  ├── lighthouse-report-[timestamp].html
  └── lighthouse-report-[timestamp].json
```

## 🔧 Troubleshooting

### Lighthouse non si avvia
```bash
# Assicurati che Lighthouse sia installato
npm install -g lighthouse

# Verifica che il sito sia in esecuzione
npm run dev

# Prova con Chrome/Chromium installato
```

### Errori di connessione
- Assicurati che il server sia in esecuzione
- Verifica che l'URL sia corretto
- Controlla i firewall/antivirus

## 📚 Risorse Aggiuntive

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse Documentation](https://github.com/GoogleChrome/lighthouse)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)


# 🔑 Setup Google PageSpeed Insights API

Questa guida ti aiuterà a configurare l'API di Google PageSpeed Insights per analizzare le prestazioni del tuo sito.

## 📋 Prerequisiti

- Account Google
- Progetto Google Cloud (puoi crearne uno nuovo)

## 🚀 Setup Veloce (5 minuti)

### 1. Crea un Progetto Google Cloud

1. Vai su: https://console.cloud.google.com/
2. Clicca su "Select a project" in alto
3. Clicca su "New Project"
4. Inserisci un nome (es: "PageSpeed Insights")
5. Clicca "Create"

### 2. Abilita PageSpeed Insights API

1. Vai su: https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com
2. Assicurati che il progetto corretto sia selezionato
3. Clicca su "Enable"

### 3. Crea una Chiave API

1. Vai su: https://console.cloud.google.com/apis/credentials
2. Clicca su "Create Credentials" → "API Key"
3. Copia la chiave API generata
4. (Opzionale) Clicca "Restrict Key" per limitare l'uso:
   - In "API restrictions", seleziona "Restrict key"
   - Scegli "PageSpeed Insights API"
   - Clicca "Save"

### 4. Aggiungi la Chiave al Progetto

Aggiungi la chiave API al file `.env.local`:

```bash
# .env.local
GOOGLE_PAGESPEED_API_KEY=your_api_key_here
```

⚠️ **Importante**: Non committare mai il file `.env.local` nel repository Git!

## ✅ Verifica Setup

Testa la configurazione:

```bash
# Analizza localhost (mobile)
npm run analyze:pagespeed:local

# Analizza localhost (desktop)
npm run analyze:pagespeed:desktop

# Analizza un sito personalizzato
GOOGLE_PAGESPEED_API_KEY=your_key SITE_URL=https://tuo-sito.com npm run analyze:pagespeed
```

## 📊 Limiti e Costi

### Quota Gratuita
- **25,000 richieste al giorno** per progetto
- **Gratuito** fino a 25,000 richieste/giorno
- Più che sufficiente per uso personale/professionale

### Monitoraggio Quota
- Vai su: https://console.cloud.google.com/apis/api/pagespeedonline.googleapis.com/quotas
- Controlla l'uso quotidiano

## 🔧 Troubleshooting

### Errore: "API key not valid"
- Verifica che la chiave sia corretta
- Assicurati che PageSpeed Insights API sia abilitata
- Controlla le restrizioni della chiave API

### Errore: "PERMISSION_DENIED"
- Verifica che l'API sia abilitata nel progetto
- Controlla che la chiave API abbia i permessi corretti

### Errore: "INVALID_ARGUMENT"
- Verifica che l'URL sia valido e accessibile
- Per localhost, assicurati che il server sia in esecuzione
- Per URL pubblici, devono essere accessibili da internet

## 📝 Uso

### Comandi Disponibili

```bash
# Analizza localhost (mobile - default)
npm run analyze:pagespeed:local

# Analizza localhost (desktop)
npm run analyze:pagespeed:desktop

# Analizza un sito personalizzato
npm run analyze:pagespeed:production

# Con URL personalizzato
SITE_URL=https://example.com npm run analyze:pagespeed
```

### Report Generati

I report vengono salvati in:
```
performance-reports/
  ├── pagespeed-mobile-[timestamp].html
  ├── pagespeed-mobile-[timestamp].json
  ├── pagespeed-desktop-[timestamp].html
  └── pagespeed-desktop-[timestamp].json
```

## 🔒 Sicurezza

### Best Practices
1. ✅ Usa `.env.local` per le chiavi API (non committare)
2. ✅ Limita la chiave API solo a PageSpeed Insights API
3. ✅ Aggiungi restrizioni IP se possibile
4. ✅ Monitora l'uso della quota

### Aggiungi a .gitignore
Assicurati che `.env.local` sia in `.gitignore`:
```
.env.local
.env*.local
```

## 📚 Risorse

- [Google Cloud Console](https://console.cloud.google.com/)
- [PageSpeed Insights API Docs](https://developers.google.com/speed/docs/insights/v5/get-started)
- [API Reference](https://developers.google.com/speed/docs/insights/v5/rest/v5/pagespeedapi/runpagespeed)


# Area Clienti - Documentazione

## Panoramica

L'Area Clienti è una sezione riservata e protetta da password che permette ai clienti di accedere a contenuti esclusivi, documenti, video tutorial e promozioni speciali.

## Caratteristiche Principali

### 🔐 Protezione Password
- Accesso protetto tramite password configurabile tramite variabile d'ambiente
- Sessione persistente per 24 ore
- Logout automatico alla scadenza

### 📁 Tipi di Contenuto

#### 1. Video
- **YouTube/Vimeo**: Embed di video esterni
- **File Locali**: Upload e riproduzione di file video
- **Categorie**: Tutorial, Presentazione, Demo, Formazione
- **Anteprime**: Thumbnail personalizzabili

#### 2. Documenti
- **Formati Supportati**: PDF, Word, Excel, PowerPoint, Immagini
- **Download Tracking**: Contatore dei download
- **Anteprime**: Immagini di preview
- **Categorie**: Manuali, Contratti, Fatturazione, Moduli, Guide

#### 3. Nozioni (Knowledge Base)
- **Contenuto Rich Text**: Editor Sanity con supporto markdown
- **Livelli di Difficoltà**: Principiante, Intermedio, Avanzato
- **Tempo di Lettura**: Stima automatica
- **Categorie**: FAQ, Tutorial, Best Practice, Troubleshooting

#### 4. Promozioni
- **Date di Validità**: Inizio e scadenza configurabili
- **Sconti**: Percentuali o importi fissi
- **Codici Promo**: Codici promozionali personalizzabili
- **Target Audience**: Filtri per tipologia di cliente
- **In Evidenza**: Promozioni speciali

## Configurazione

### 1. Variabili d'Ambiente

Aggiungi al tuo file `.env.local`:

```bash
AREA_CLIENTI_PASSWORD=your_secure_password_here
```

### 2. Schemi Sanity

I seguenti schemi sono stati aggiunti a Sanity:

- `clientVideo` - Gestione video
- `clientDocument` - Gestione documenti
- `clientKnowledge` - Gestione nozioni
- `clientPromotion` - Gestione promozioni

### 3. Accesso

L'Area Clienti è accessibile tramite:
- URL: `/area-clienti`
- Link nell'header del sito: "Area Clienti"

## Utilizzo

### Per i Clienti

1. **Accesso**: Clicca su "Area Clienti" nell'header
2. **Login**: Inserisci la password fornita
3. **Navigazione**: Usa le tab per esplorare i contenuti:
   - **Panoramica**: Statistiche e benvenuto
   - **Video**: Tutorial e guide video
   - **Documenti**: Download di risorse
   - **Nozioni**: Base di conoscenza
   - **Promozioni**: Offerte speciali

### Per gli Amministratori

1. **Gestione Contenuti**: Accedi a Sanity Studio (`/studio`)
2. **Creazione Contenuti**: Usa i nuovi schemi per creare contenuti
3. **Organizzazione**: Utilizza categorie e tag per organizzare
4. **Monitoraggio**: Controlla download e statistiche

## Query GROQ Esempi

### Recuperare tutti i video
```groq
*[_type == "clientVideo" && isActive == true] | order(order asc, _createdAt desc) {
  _id, title, description, videoType, videoUrl, thumbnail, categories, tags
}
```

### Recuperare documenti per categoria
```groq
*[_type == "clientDocument" && isActive == true && "manuali" in categories] | order(order asc) {
  _id, title, file, fileType, categories, downloadCount
}
```

### Recuperare promozioni attive
```groq
*[_type == "clientPromotion" && isActive == true && endDate > now()] | order(endDate asc) {
  _id, title, description, image, endDate, discountPercentage, promoCode
}
```

## Componenti React

### Struttura Modulare

```
src/components/ClientArea/
├── ClientAreaContent.tsx          # Componente principale
├── LoginForm.tsx                  # Form di login
├── VideoCard.tsx                  # Card per video
├── DocumentCard.tsx               # Card per documenti
├── KnowledgeCard.tsx              # Card per nozioni
├── PromotionCard.tsx              # Card per promozioni
├── VideoModal.tsx                 # Modal per riproduzione video
└── tabs/
    ├── VideoTab.tsx               # Tab video
    ├── DocumentsTab.tsx           # Tab documenti
    ├── KnowledgeTab.tsx           # Tab nozioni
    └── PromotionsTab.tsx          # Tab promozioni
```

### Context API

```typescript
// Utilizzo del Context
const { isAuthenticated, login, logout, isLoading } = useClientAreaAuth();
```

## Personalizzazione

### Stili CSS

I componenti utilizzano Tailwind CSS e possono essere personalizzati modificando le classi:

- **Colori**: Cambia le classi `bg-blue-*`, `text-blue-*`
- **Layout**: Modifica le griglie e spacing
- **Animazioni**: Personalizza le transizioni

### Funzionalità Aggiuntive

Per estendere l'Area Clienti:

1. **Nuovi Tipi di Contenuto**: Aggiungi schemi Sanity
2. **Nuove Funzionalità**: Estendi i componenti esistenti
3. **Integrazioni**: Aggiungi servizi esterni (es. analytics)

## Sicurezza

### Note Importanti

- La password è memorizzata solo lato server
- La sessione scade automaticamente dopo 24 ore
- I contenuti sono protetti da accesso non autorizzato
- Non utilizzare per dati sensibili (implementare autenticazione robusta)

### Raccomandazioni

- Cambia regolarmente la password
- Monitora gli accessi
- Backup regolari dei contenuti Sanity
- HTTPS in produzione

## Troubleshooting

### Problemi Comuni

1. **Password non funziona**: Verifica la variabile `AREA_CLIENTI_PASSWORD`
2. **Contenuti non si caricano**: Controlla le query GROQ e la connessione Sanity
3. **Errori di build**: Verifica che tutti i componenti siano importati correttamente

### Debug

Attiva i log nella console del browser per vedere gli errori di fetch e autenticazione.

## Roadmap Future

- [ ] Sistema di notifiche per nuovi contenuti
- [ ] Commenti e feedback sui contenuti
- [ ] Sistema di preferiti
- [ ] Download in batch
- [ ] Ricerca avanzata
- [ ] Mobile app dedicata

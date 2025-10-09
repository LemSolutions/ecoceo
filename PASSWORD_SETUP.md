# 🔐 Configurazione Password

Questo progetto utilizza environment variables per gestire le password di accesso alle aree protette.

## 📋 Password Richieste

### 1. Area Clienti
- **Variabile:** `AREA_CLIENTI_PASSWORD`
- **Tipo:** Server-side (non esposta al browser)
- **Utilizzo:** Protegge l'accesso all'area riservata ai clienti
- **Dove:** `/area-clienti`

### 2. Dashboard
- **Variabile:** `NEXT_PUBLIC_DASHBOARD_PASSWORD`
- **Tipo:** Client-side (accessibile dal browser - prefisso NEXT_PUBLIC)
- **Utilizzo:** Protegge l'accesso alla dashboard aziendale
- **Dove:** `/dashboard`

## ⚙️ Setup Locale

1. Copia il file `env.example` in `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Modifica `.env.local` e imposta le tue password:
   ```env
   # Area Clienti (server-side)
   AREA_CLIENTI_PASSWORD=TuaPasswordSicura123!
   
   # Dashboard (client-side)
   NEXT_PUBLIC_DASHBOARD_PASSWORD=TuaPasswordDashboard456!
   ```

3. Riavvia il server di sviluppo:
   ```bash
   npm run dev
   ```

## 🚀 Setup in Produzione (Vercel/Netlify)

1. Vai nelle impostazioni del tuo progetto
2. Aggiungi le environment variables:
   - `AREA_CLIENTI_PASSWORD`: la tua password per l'area clienti
   - `NEXT_PUBLIC_DASHBOARD_PASSWORD`: la tua password per la dashboard
3. Rideploy il progetto

## 🔒 Note di Sicurezza

- ⚠️ **AREA_CLIENTI_PASSWORD**: Non ha il prefisso `NEXT_PUBLIC_`, quindi rimane solo sul server
- ⚠️ **NEXT_PUBLIC_DASHBOARD_PASSWORD**: Ha il prefisso `NEXT_PUBLIC_`, quindi è visibile nel browser (client-side)
- 🔐 Usa password complesse (minimo 12 caratteri, con maiuscole, minuscole, numeri e simboli)
- 🚫 Non committare mai il file `.env.local` nel repository
- 🔄 Cambia le password regolarmente
- 📝 Mantieni le password in un password manager sicuro

## 🆘 Recupero Password

Se dimentichi le password:
1. **Locale**: Controlla il file `.env.local`
2. **Produzione**: Controlla le environment variables nella dashboard del tuo hosting

## 📚 Password di Default

**SOLO per sviluppo locale**, se non imposti le variabili d'ambiente, verranno usate queste password di fallback:
- Dashboard: `Dashboard2024!`
- Area Clienti: Nessuna password di fallback (deve essere impostata)

⚠️ **IMPORTANTE**: In produzione, DEVI impostare le password nelle environment variables!


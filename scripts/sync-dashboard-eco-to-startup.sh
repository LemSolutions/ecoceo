#!/bin/bash

# Script per sincronizzare dashboard da Ecoceo a Startup
# Uso: ./sync-dashboard-eco-to-startup.sh

SOURCE="/Users/gaiofabiano/Library/Mobile Documents/com~apple~CloudDocs/LEM SOLUTIONS/ecoceo/ecoceo"
DEST="/Users/gaiofabiano/Downloads/startup-nextjs-main 2"

echo "🔄 Sincronizzazione Ecoceo → Startup..."
echo "📁 Sorgente: $SOURCE"
echo "📁 Destinazione: $DEST"

# Verifica che la destinazione esista
if [ ! -d "$DEST" ]; then
    echo "❌ Errore: La cartella di destinazione non esiste: $DEST"
    exit 1
fi

# Backup della destinazione
echo "💾 Creando backup della destinazione..."
BACKUP_DIR="$DEST-backup-$(date +%Y%m%d_%H%M%S)"
cp -r "$DEST" "$BACKUP_DIR"
echo "✅ Backup creato: $BACKUP_DIR"

# Componenti Dashboard
echo "📂 Copiando componenti Dashboard..."
cp -r "$SOURCE/src/components/Dashboard/"* "$DEST/src/components/Dashboard/"

# Pagine Dashboard
echo "📂 Copiando pagine Dashboard..."
cp -r "$SOURCE/src/app/(dashboard)/"* "$DEST/src/app/(dashboard)/"

# Contexti
echo "📂 Copiando Contexti..."
cp "$SOURCE/src/contexts/DashboardContext.tsx" "$DEST/src/contexts/" 2>/dev/null
cp "$SOURCE/src/contexts/InfoModalContext.tsx" "$DEST/src/contexts/" 2>/dev/null

# Config e Hook
echo "📂 Copiando configurazione e hook..."
cp "$SOURCE/src/config/auth.ts" "$DEST/src/config/" 2>/dev/null
cp "$SOURCE/src/hooks/useClientDate.ts" "$DEST/src/hooks/" 2>/dev/null
cp "$SOURCE/src/hooks/useClientAnalytics.ts" "$DEST/src/hooks/" 2>/dev/null
cp "$SOURCE/src/services/mockDataService.ts" "$DEST/src/services/" 2>/dev/null
cp "$SOURCE/src/components/Auth/ProtectedRoute.tsx" "$DEST/src/components/Auth/" 2>/dev/null

# Documentazione sync
echo "📂 Copiando documentazione sync..."
cp "$SOURCE/docs/DASHBOARD_SYNC_GUIDE.md" "$DEST/docs/" 2>/dev/null

echo "✅ Sincronizzazione completata!"
echo ""
echo "📋 Prossimi passi:"
echo "1. Vai nel progetto di destinazione: cd '$DEST'"
echo "2. Installa dipendenze: npm install"
echo "3. Verifica configurazione: .env.local"
echo "4. Testa dashboard: npm run dev"
echo ""
echo "💾 Backup disponibile in: $BACKUP_DIR"

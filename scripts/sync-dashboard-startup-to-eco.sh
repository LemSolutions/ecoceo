#!/bin/bash

# Script per sincronizzare dashboard da Startup a Ecoceo
# Uso: ./sync-dashboard-startup-to-eco.sh

SOURCE="/Users/gaiofabiano/Downloads/startup-nextjs-main 2"
DEST="/Users/gaiofabiano/Library/Mobile Documents/com~apple~CloudDocs/LEM SOLUTIONS/ecoceo/ecoceo"

echo "🔄 Sincronizzazione Startup → Ecoceo..."
echo "📁 Sorgente: $SOURCE"
echo "📁 Destinazione: $DEST"

# Verifica che la sorgente esista
if [ ! -d "$SOURCE" ]; then
    echo "❌ Errore: La cartella sorgente non esiste: $SOURCE"
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

echo "✅ Sincronizzazione completata!"
echo ""
echo "📋 Prossimi passi:"
echo "1. Testa dashboard: npm run dev"
echo "2. Verifica funzionalità: http://localhost:3000/dashboard"
echo ""
echo "💾 Backup disponibile in: $BACKUP_DIR"

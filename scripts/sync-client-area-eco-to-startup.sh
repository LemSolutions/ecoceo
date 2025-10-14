#!/bin/bash

# Script per sincronizzare Area Clienti da Ecoceo a Startup
# Uso: ./sync-client-area-eco-to-startup.sh

SOURCE="/Users/gaiofabiano/Library/Mobile Documents/com~apple~CloudDocs/LEM SOLUTIONS/ecoceo/ecoceo"
DEST="/Users/gaiofabiano/Downloads/startup-nextjs-main 2"

echo "🔄 Sincronizzazione Area Clienti Ecoceo → Startup..."
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

# Area Clienti - Componenti
echo "📂 Copiando componenti Area Clienti..."
cp -r "$SOURCE/src/components/ClientArea/"* "$DEST/src/components/ClientArea/"

# Area Clienti - Pagina
echo "📂 Copiando pagina Area Clienti..."
mkdir -p "$DEST/src/app/(public)/area-clienti"
cp "$SOURCE/src/app/(public)/area-clienti/page.tsx" "$DEST/src/app/(public)/area-clienti/"

# Area Clienti - Contexto
echo "📂 Copiando Contexto Area Clienti..."
cp "$SOURCE/src/contexts/ClientAreaAuthContext.tsx" "$DEST/src/contexts/"

# Area Clienti - Query Sanity
echo "📂 Copiando Query Sanity..."
cp "$SOURCE/src/sanity/lib/clientAreaQueries.ts" "$DEST/src/sanity/lib/"

# Area Clienti - Schema Sanity
echo "📂 Copiando Schema Sanity..."
mkdir -p "$DEST/src/sanity/schemaTypes/clientArea"
cp -r "$SOURCE/src/sanity/schemaTypes/clientArea/"* "$DEST/src/sanity/schemaTypes/clientArea/"

# Area Clienti - Tipi TypeScript
echo "📂 Copiando Tipi TypeScript..."
cp "$SOURCE/src/types/clientArea.ts" "$DEST/src/types/"

# Configurazione auth (se non esiste già)
echo "📂 Verificando configurazione auth..."
if [ ! -f "$DEST/src/config/auth.ts" ]; then
    cp "$SOURCE/src/config/auth.ts" "$DEST/src/config/"
fi

echo "✅ Sincronizzazione Area Clienti completata!"
echo ""
echo "📋 Prossimi passi:"
echo "1. Vai nel progetto di destinazione: cd '$DEST'"
echo "2. Installa dipendenze: npm install"
echo "3. Verifica configurazione: .env.local (AREA_CLIENTI_PASSWORD)"
echo "4. Testa area clienti: npm run dev"
echo "5. Vai su: http://localhost:3000/area-clienti"
echo ""
echo "💾 Backup disponibile in: $BACKUP_DIR"
echo ""
echo "📊 Area Clienti esportata con:"
echo "- Componenti ClientArea (7 componenti + tabs)"
echo "- Pagina /area-clienti"
echo "- Contexto autenticazione"
echo "- Query Sanity"
echo "- Schema Sanity (video, document, knowledge, promotion)"
echo "- Tipi TypeScript"

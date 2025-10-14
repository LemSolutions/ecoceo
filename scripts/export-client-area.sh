#!/bin/bash

# Script per esportare l'Area Clienti completa
# Uso: ./export-client-area.sh /path/to/destination/project

if [ -z "$1" ]; then
    echo "❌ Errore: Specifica il percorso di destinazione"
    echo "Uso: ./export-client-area.sh /path/to/destination/project"
    exit 1
fi

DESTINATION="$1"

echo "🚀 Esportazione Area Clienti in corso..."
echo "📁 Destinazione: $DESTINATION"

# Verifica che la destinazione esista
if [ ! -d "$DESTINATION" ]; then
    echo "❌ Errore: La cartella di destinazione non esiste"
    exit 1
fi

# Crea le cartelle necessarie
mkdir -p "$DESTINATION/src/components/ClientArea"
mkdir -p "$DESTINATION/src/app/(public)/area-clienti"
mkdir -p "$DESTINATION/src/contexts"
mkdir -p "$DESTINATION/src/sanity/lib"
mkdir -p "$DESTINATION/src/types"

echo "📂 Copiando componenti Area Clienti..."
cp -r src/components/ClientArea/* "$DESTINATION/src/components/ClientArea/"

echo "📂 Copiando pagina Area Clienti..."
cp src/app/\(public\)/area-clienti/page.tsx "$DESTINATION/src/app/\(public\)/area-clienti/"

echo "📂 Copiando Contexto Area Clienti..."
cp src/contexts/ClientAreaAuthContext.tsx "$DESTINATION/src/contexts/"

echo "📂 Copiando Query Sanity..."
cp src/sanity/lib/clientAreaQueries.ts "$DESTINATION/src/sanity/lib/"

echo "📂 Copiando Tipi TypeScript..."
cp src/types/clientArea.ts "$DESTINATION/src/types/"

echo "📂 Copiando configurazione auth..."
cp src/config/auth.ts "$DESTINATION/src/config/" 2>/dev/null || echo "⚠️  auth.ts non trovato"

echo "✅ Esportazione Area Clienti completata!"
echo ""
echo "📋 File esportati:"
echo "📁 src/components/ClientArea/ - Tutti i componenti area clienti"
echo "📁 src/app/(public)/area-clienti/ - Pagina area clienti"
echo "📁 src/contexts/ClientAreaAuthContext.tsx - Contexto autenticazione"
echo "📁 src/sanity/lib/clientAreaQueries.ts - Query Sanity"
echo "📁 src/types/clientArea.ts - Tipi TypeScript"
echo ""
echo "📋 Prossimi passi:"
echo "1. Vai nel progetto di destinazione"
echo "2. Verifica le dipendenze in package.json"
echo "3. Installa eventuali dipendenze mancanti"
echo "4. Configura le variabili ambiente (AREA_CLIENTI_PASSWORD)"
echo "5. Testa l'area clienti"

#!/bin/bash

# Script per esportare la dashboard completa
# Uso: ./export-dashboard.sh /path/to/destination/project

if [ -z "$1" ]; then
    echo "❌ Errore: Specifica il percorso di destinazione"
    echo "Uso: ./export-dashboard.sh /path/to/destination/project"
    exit 1
fi

DESTINATION="$1"

echo "🚀 Esportazione Dashboard in corso..."
echo "📁 Destinazione: $DESTINATION"

# Verifica che la destinazione esista
if [ ! -d "$DESTINATION" ]; then
    echo "❌ Errore: La cartella di destinazione non esiste"
    exit 1
fi

# Crea le cartelle necessarie
mkdir -p "$DESTINATION/src/components/Dashboard"
mkdir -p "$DESTINATION/src/app/(dashboard)"
mkdir -p "$DESTINATION/src/contexts"
mkdir -p "$DESTINATION/src/config"
mkdir -p "$DESTINATION/src/hooks"
mkdir -p "$DESTINATION/src/services"
mkdir -p "$DESTINATION/src/components/Auth"

echo "📂 Copiando componenti Dashboard..."
cp -r src/components/Dashboard/* "$DESTINATION/src/components/Dashboard/"

echo "📂 Copiando pagine Dashboard..."
cp -r src/app/\(dashboard\)/* "$DESTINATION/src/app/\(dashboard\)/"

echo "📂 Copiando Contexti..."
cp src/contexts/DashboardContext.tsx "$DESTINATION/src/contexts/" 2>/dev/null || echo "⚠️  DashboardContext.tsx non trovato"
cp src/contexts/InfoModalContext.tsx "$DESTINATION/src/contexts/" 2>/dev/null || echo "⚠️  InfoModalContext.tsx non trovato"

echo "📂 Copiando configurazione..."
cp src/config/auth.ts "$DESTINATION/src/config/" 2>/dev/null || echo "⚠️  auth.ts non trovato"

echo "📂 Copiando Hook..."
cp src/hooks/useClientDate.ts "$DESTINATION/src/hooks/" 2>/dev/null || echo "⚠️  useClientDate.ts non trovato"
cp src/hooks/useClientAnalytics.ts "$DESTINATION/src/hooks/" 2>/dev/null || echo "⚠️  useClientAnalytics.ts non trovato"

echo "📂 Copiando Servizi..."
cp src/services/mockDataService.ts "$DESTINATION/src/services/" 2>/dev/null || echo "⚠️  mockDataService.ts non trovato"

echo "📂 Copiando componenti Auth..."
cp src/components/Auth/ProtectedRoute.tsx "$DESTINATION/src/components/Auth/" 2>/dev/null || echo "⚠️  ProtectedRoute.tsx non trovato"

echo "✅ Esportazione completata!"
echo ""
echo "📋 Prossimi passi:"
echo "1. Vai nel progetto di destinazione"
echo "2. Verifica le dipendenze in package.json"
echo "3. Installa eventuali dipendenze mancanti"
echo "4. Testa la dashboard"

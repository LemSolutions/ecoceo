#!/bin/bash

# Script per pulire file inutilizzati nel progetto
# Mantiene solo i file essenziali e la documentazione core

echo "🧹 Avvio pulizia file inutilizzati..."

# Backup della documentazione essenziale
mkdir -p docs-essential

echo "📋 Mantenendo documentazione essenziale..."
cp docs/README.md docs-essential/ 2>/dev/null
cp docs/DASHBOARD_SYNC_GUIDE.md docs-essential/ 2>/dev/null
cp docs/setup/ENVIRONMENT_SETUP.md docs-essential/ 2>/dev/null
cp docs/setup/SETUP_DATABASE.md docs-essential/ 2>/dev/null
cp docs/setup/SUPABASE_SETUP.md docs-essential/ 2>/dev/null
cp docs/database/*.sql docs-essential/ 2>/dev/null

# Backup degli script essenziali
mkdir -p scripts-essential
cp scripts/cleanup-*.sh scripts-essential/ 2>/dev/null
cp scripts/export-dashboard.sh scripts-essential/ 2>/dev/null
cp scripts/setup-*.js scripts-essential/ 2>/dev/null

echo "🗑️  Rimuovendo documentazione non utilizzata..."
# Rimuovi docs non utilizzati (mantieni solo quelli essenziali)
find docs -name "README.md" -not -path "docs/setup/*" -not -path "docs/database/*" -delete 2>/dev/null
rm -rf docs/api docs/area-clienti docs/asset-management docs/audit
rm -rf docs/availability-management docs/backup docs/business-plan
rm -rf docs/capacity-management docs/change-management docs/compliance
rm -rf docs/components docs/configuration-management docs/contract-management
rm -rf docs/customer-management docs/deployment docs/digital-transformation
rm -rf docs/disaster-recovery docs/ethics docs/financial docs/governance
rm -rf docs/incident-management docs/innovation-management docs/integration
rm -rf docs/knowledge-management docs/maintenance docs/marketing
rm -rf docs/migration docs/monitoring docs/optimization docs/performance
rm -rf docs/problem-management docs/projects docs/quality-management
rm -rf docs/recovery docs/release-management docs/risk-management
rm -rf docs/rollback docs/scaling docs/security docs/service-level-management
rm -rf docs/sustainability docs/tasks docs/testing docs/troubleshooting
rm -rf docs/upgrade docs/vendor-management

echo "🗑️  Rimuovendo script di test obsoleti..."
# Rimuovi script di test che non servono più
rm -f scripts/test-*.js
rm -f scripts/populate-*.js
rm -f scripts/check-*.js
rm -f scripts/fix-*.js
rm -f scripts/verify-*.js
rm -f scripts/create-*.js
rm -f scripts/execute-*.js
rm -f scripts/insert-*.js
rm -f scripts/apply-*.js

echo "🗑️  Rimuovendo file di backup vecchi..."
# Rimuovi backup vecchi (mantieni solo l'ultimo)
rm -rf backup-before-separation/20251003_124246

echo "🗑️  Rimuovendo file di configurazione temporanei..."
# Rimuovi file temporanei
rm -f tsconfig.tsbuildinfo
rm -f .next/cache
rm -f .next/static

echo "📁 Riorganizzando documentazione essenziale..."
# Riorganizza docs
mkdir -p docs/core
mv docs-essential/* docs/core/ 2>/dev/null
rmdir docs-essential

echo "📁 Riorganizzando script essenziali..."
# Riorganizza scripts
mkdir -p scripts/core
mv scripts-essential/* scripts/core/ 2>/dev/null
rmdir scripts-essential

echo "✅ Pulizia completata!"
echo ""
echo "📊 File mantenuti:"
echo "📁 docs/core/ - Documentazione essenziale"
echo "📁 scripts/core/ - Script essenziali"
echo "📁 src/ - Codice sorgente completo"
echo "📁 docs/database/ - Script SQL database"
echo "📁 docs/setup/ - Guide setup"
echo ""
echo "🗑️  File rimossi:"
echo "- Documentazione non utilizzata"
echo "- Script di test obsoleti"
echo "- File di backup vecchi"
echo "- File temporanei"
echo ""
echo "💡 Per ripristinare, usa git checkout per i file rimossi"
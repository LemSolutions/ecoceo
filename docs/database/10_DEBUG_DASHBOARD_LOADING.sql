-- =====================================================
-- DEBUG DASHBOARD LOADING ISSUES
-- =====================================================
-- Script per debuggare i problemi di caricamento nella dashboard
-- =====================================================

-- 1. VERIFICA DATE FORMATS
-- =====================================================

-- Controlla il formato delle date nelle tabelle
SELECT 
    'financial_fixed_costs' as table_name,
    next_payment_date,
    COUNT(*) as count_records
FROM financial_fixed_costs 
WHERE user_id = 'default-user'
GROUP BY next_payment_date
ORDER BY next_payment_date;

SELECT 
    'financial_variable_costs' as table_name,
    date,
    COUNT(*) as count_records
FROM financial_variable_costs 
WHERE user_id = 'default-user'
GROUP BY date
ORDER BY date;

SELECT 
    'financial_revenues' as table_name,
    received_date,
    COUNT(*) as count_records
FROM financial_revenues 
WHERE user_id = 'default-user'
GROUP BY received_date
ORDER BY received_date;

-- 2. VERIFICA DATI PER OGGI
-- =====================================================

-- Mostra la data di oggi per confronto
SELECT 
    'DATA DI OGGI' as info,
    CURRENT_DATE::text as today_date,
    CURRENT_TIMESTAMP::text as current_timestamp;

-- Verifica se ci sono dati per oggi
SELECT 
    'DATI PER OGGI' as check_type,
    (SELECT COUNT(*) FROM financial_fixed_costs WHERE user_id = 'default-user' AND next_payment_date = CURRENT_DATE::text) as fixed_costs_today,
    (SELECT COUNT(*) FROM financial_variable_costs WHERE user_id = 'default-user' AND date = CURRENT_DATE::text) as variable_costs_today,
    (SELECT COUNT(*) FROM financial_revenues WHERE user_id = 'default-user' AND received_date = CURRENT_DATE::text) as revenues_today;

-- 3. SIMULA IL CALCOLO DELLA DASHBOARD
-- =====================================================

-- Simula esattamente quello che fa il codice JavaScript
WITH today_data AS (
    SELECT 
        COALESCE(SUM(CASE WHEN next_payment_date = CURRENT_DATE::text THEN amount ELSE 0 END), 0) as today_fixed_costs,
        COALESCE(SUM(CASE WHEN date = CURRENT_DATE::text THEN amount ELSE 0 END), 0) as today_variable_costs,
        COALESCE(SUM(CASE WHEN received_date = CURRENT_DATE::text THEN amount ELSE 0 END), 0) as today_revenues
    FROM (
        SELECT amount, next_payment_date, NULL as date, NULL as received_date FROM financial_fixed_costs WHERE user_id = 'default-user'
        UNION ALL
        SELECT amount, NULL as next_payment_date, date, NULL as received_date FROM financial_variable_costs WHERE user_id = 'default-user'
        UNION ALL
        SELECT amount, NULL as next_payment_date, NULL as date, received_date FROM financial_revenues WHERE user_id = 'default-user'
    ) all_data
)
SELECT 
    today_fixed_costs as "Costi Fissi Oggi",
    today_variable_costs as "Costi Variabili Oggi", 
    today_revenues as "Entrate Oggi",
    (today_revenues - today_fixed_costs - today_variable_costs) as "Flusso Netto Oggi"
FROM today_data;

-- 4. VERIFICA STRUTTURA COLONNE
-- =====================================================

-- Verifica che le colonne necessarie esistano
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('financial_fixed_costs', 'financial_variable_costs', 'financial_revenues')
AND column_name IN ('next_payment_date', 'date', 'received_date', 'amount', 'user_id')
ORDER BY table_name, column_name;

-- 5. TEST CONNESSIONE E PERMESSI
-- =====================================================

-- Test di lettura base
SELECT 'Test lettura financial_fixed_costs' as test, COUNT(*) as records FROM financial_fixed_costs;
SELECT 'Test lettura financial_variable_costs' as test, COUNT(*) as records FROM financial_variable_costs;
SELECT 'Test lettura financial_revenues' as test, COUNT(*) as records FROM financial_revenues;

-- Test lettura con filtro user_id
SELECT 'Test filtro user_id' as test, COUNT(*) as records FROM financial_fixed_costs WHERE user_id = 'default-user';

-- =====================================================
-- DEBUG COMPLETATO
-- =====================================================
-- Questo script ti aiuterà a identificare esattamente 
-- perché la dashboard non carica i dati finanziari

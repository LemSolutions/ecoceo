-- =====================================================
-- INSERT TODAY'S FINANCIAL DATA FOR DASHBOARD TEST
-- =====================================================
-- Inserisce dati finanziari per "oggi" per testare il caricamento nella dashboard
-- =====================================================

-- Ottieni la data di oggi nel formato corretto (YYYY-MM-DD)
-- Sostituisci con la data di oggi quando esegui lo script
-- Esempio: '2024-01-15'

-- 1. INSERT TODAY'S FIXED COSTS
-- =====================================================

-- Inserisci costi fissi con next_payment_date = oggi
INSERT INTO financial_fixed_costs (
    user_id, name, description, amount, category, 
    frequency, start_date, end_date, payment_day, 
    vendor, is_paid, next_payment_date
) VALUES 
(
    'default-user', 
    'Affitto Ufficio - Gennaio', 
    'Affitto mensile dell''ufficio principale per gennaio', 
    1200.00, 
    'Immobiliare',
    'monthly',
    '2024-01-01',
    '2024-12-31',
    1,
    'Immobiliare Milano Srl',
    false,
    CURRENT_DATE::text  -- Data di oggi
),
(
    'default-user', 
    'Abbonamento Software - Gennaio', 
    'Licenze software per il team per gennaio', 
    299.00, 
    'Tecnologia',
    'monthly',
    '2024-01-01',
    '2024-12-31',
    15,
    'Microsoft Office 365',
    false,
    CURRENT_DATE::text  -- Data di oggi
);

-- 2. INSERT TODAY'S VARIABLE COSTS
-- =====================================================

INSERT INTO financial_variable_costs (
    user_id, name, description, amount, category, 
    frequency, start_date, end_date, payment_day, 
    vendor, is_paid, date
) VALUES 
(
    'default-user', 
    'Materiale di Consumo - Oggi', 
    'Carta, penne, materiale d''ufficio acquistato oggi', 
    89.50, 
    'Ufficio',
    'one-time',
    CURRENT_DATE::text,
    CURRENT_DATE::text,
    20,
    'Cartoleria Centro',
    true,
    CURRENT_DATE::text  -- Data di oggi
),
(
    'default-user', 
    'Marketing Online - Oggi', 
    'Campagne pubblicitarie Google Ads per oggi', 
    350.00, 
    'Marketing',
    'one-time',
    CURRENT_DATE::text,
    CURRENT_DATE::text,
    10,
    'Google Ads',
    false,
    CURRENT_DATE::text  -- Data di oggi
);

-- 3. INSERT TODAY'S REVENUES
-- =====================================================

INSERT INTO financial_revenues (
    user_id, name, description, amount, source, 
    client, invoice_number, received_date, 
    is_received, category
) VALUES 
(
    'default-user', 
    'Sviluppo Sito Web - Pagamento Oggi', 
    'Pagamento ricevuto oggi per progetto di sviluppo sito web', 
    2500.00, 
    'services',
    'Azienda ABC Srl',
    'FAT-2024-001',
    CURRENT_DATE::text,  -- Data di oggi
    true,
    'Sviluppo Software'
),
(
    'default-user', 
    'Consulenza Marketing - Pagamento Oggi', 
    'Pagamento ricevuto oggi per consulenza marketing', 
    1200.00, 
    'services',
    'Negozio XYZ',
    'FAT-2024-002',
    CURRENT_DATE::text,  -- Data di oggi
    true,
    'Consulenza'
);

-- 4. VERIFICA INSERIMENTI PER OGGI
-- =====================================================

-- Mostra i dati inseriti per oggi
SELECT 'Costi Fissi di Oggi' as tipo, name, amount, next_payment_date
FROM financial_fixed_costs
WHERE user_id = 'default-user' 
AND next_payment_date = CURRENT_DATE::text
UNION ALL
SELECT 'Costi Variabili di Oggi' as tipo, name, amount, date
FROM financial_variable_costs
WHERE user_id = 'default-user' 
AND date = CURRENT_DATE::text
UNION ALL
SELECT 'Entrate di Oggi' as tipo, name, amount, received_date
FROM financial_revenues
WHERE user_id = 'default-user' 
AND received_date = CURRENT_DATE::text
ORDER BY tipo, name;

-- Calcola i totali per oggi (come fa la dashboard)
SELECT 
    'RIEPILOGO FINANZIARIO OGGI' as titolo,
    (SELECT COALESCE(SUM(amount), 0) 
     FROM financial_fixed_costs 
     WHERE user_id = 'default-user' 
     AND next_payment_date = CURRENT_DATE::text) as costi_fissi,
    (SELECT COALESCE(SUM(amount), 0) 
     FROM financial_variable_costs 
     WHERE user_id = 'default-user' 
     AND date = CURRENT_DATE::text) as costi_variabili,
    (SELECT COALESCE(SUM(amount), 0) 
     FROM financial_revenues 
     WHERE user_id = 'default-user' 
     AND received_date = CURRENT_DATE::text) as entrate;

-- Calcola il flusso netto
SELECT 
    'FLUSSO NETTO OGGI' as titolo,
    (
        (SELECT COALESCE(SUM(amount), 0) FROM financial_revenues WHERE user_id = 'default-user' AND received_date = CURRENT_DATE::text) -
        (SELECT COALESCE(SUM(amount), 0) FROM financial_fixed_costs WHERE user_id = 'default-user' AND next_payment_date = CURRENT_DATE::text) -
        (SELECT COALESCE(SUM(amount), 0) FROM financial_variable_costs WHERE user_id = 'default-user' AND date = CURRENT_DATE::text)
    ) as flusso_netto;

-- =====================================================
-- TODAY'S DATA INSERTED
-- =====================================================
-- Ora la dashboard dovrebbe mostrare i dati per oggi

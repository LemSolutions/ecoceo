const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili d\'ambiente Supabase mancanti');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTodayFinancialData() {
  try {
    console.log('🔄 Inserimento dati finanziari per oggi...');
    
    const today = new Date().toISOString().split('T')[0];
    console.log('📅 Data di oggi:', today);
    
    // Inserisci costi fissi
    const fixedCosts = [
      {
        user_id: 'default-user',
        name: 'Affitto Ufficio',
        description: 'Affitto mensile dell\'ufficio principale',
        amount: 1200.00,
        frequency: 'monthly',
        category: 'operational',
        start_date: today,
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        payment_day: 1,
        next_payment_date: today,
        is_paid: false
      },
      {
        user_id: 'default-user',
        name: 'Assicurazione Auto Aziendale',
        description: 'Assicurazione RC Auto per veicolo aziendale',
        amount: 150.00,
        frequency: 'monthly',
        category: 'insurance',
        start_date: today,
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        payment_day: 1,
        next_payment_date: today,
        is_paid: false
      },
      {
        user_id: 'default-user',
        name: 'Software Licenze',
        description: 'Licenze software per sviluppo e marketing',
        amount: 300.00,
        frequency: 'monthly',
        category: 'technology',
        start_date: today,
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        payment_day: 1,
        next_payment_date: today,
        is_paid: false
      }
    ];

    const { data: fixedCostsResult, error: fixedCostsError } = await supabase
      .from('financial_fixed_costs')
      .insert(fixedCosts);

    if (fixedCostsError) {
      console.error('❌ Errore inserimento costi fissi:', fixedCostsError);
    } else {
      console.log('✅ Costi fissi inseriti:', fixedCosts.length);
    }

    // Inserisci costi variabili
    const variableCosts = [
      {
        user_id: 'default-user',
        name: 'Marketing Digitale',
        description: 'Campagna Google Ads per il mese corrente',
        amount: 500.00,
        category: 'marketing',
        date: today,
        is_paid: false
      },
      {
        user_id: 'default-user',
        name: 'Materiale Ufficio',
        description: 'Acquisto materiale di cancelleria',
        amount: 75.00,
        category: 'operational',
        date: today,
        is_paid: false
      },
      {
        user_id: 'default-user',
        name: 'Consulenza Legale',
        description: 'Consulenza per contratti clienti',
        amount: 200.00,
        category: 'professional',
        date: today,
        is_paid: false
      }
    ];

    const { data: variableCostsResult, error: variableCostsError } = await supabase
      .from('financial_variable_costs')
      .insert(variableCosts);

    if (variableCostsError) {
      console.error('❌ Errore inserimento costi variabili:', variableCostsError);
    } else {
      console.log('✅ Costi variabili inseriti:', variableCosts.length);
    }

    // Inserisci entrate
    const revenues = [
      {
        user_id: 'default-user',
        name: 'Progetto Sito Web - Cliente ABC',
        description: 'Sviluppo sito web e-commerce per cliente ABC',
        amount: 2500.00,
        category: 'services',
        client: 'ABC S.r.l.',
        invoice_number: 'INV-2024-001',
        received_date: today,
        is_received: true
      },
      {
        user_id: 'default-user',
        name: 'Consulenza Marketing - XYZ',
        description: 'Consulenza strategia marketing digitale',
        amount: 800.00,
        category: 'consulting',
        client: 'XYZ S.p.A.',
        invoice_number: 'INV-2024-002',
        received_date: today,
        is_received: true
      },
      {
        user_id: 'default-user',
        name: 'Vendita Software - DEF',
        description: 'Licenza software personalizzato',
        amount: 1200.00,
        category: 'products',
        client: 'DEF L.t.d.',
        invoice_number: 'INV-2024-003',
        received_date: today,
        is_received: true
      }
    ];

    const { data: revenuesResult, error: revenuesError } = await supabase
      .from('financial_revenues')
      .insert(revenues);

    if (revenuesError) {
      console.error('❌ Errore inserimento entrate:', revenuesError);
    } else {
      console.log('✅ Entrate inserite:', revenues.length);
    }

    console.log('🎉 Dati finanziari di oggi inseriti con successo!');
    
    // Calcola totali
    const todayFixed = fixedCosts.reduce((sum, c) => sum + c.amount, 0);
    const todayVariable = variableCosts.reduce((sum, c) => sum + c.amount, 0);
    const todayRevenues = revenues.reduce((sum, r) => sum + r.amount, 0);
    const netFlow = todayRevenues - todayFixed - todayVariable;
    
    console.log('📊 Riepilogo:');
    console.log(`   💰 Costi Fissi: €${todayFixed.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`);
    console.log(`   🛒 Costi Variabili: €${todayVariable.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`);
    console.log(`   💳 Entrate: €${todayRevenues.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`);
    console.log(`   📈 Flusso Netto: €${netFlow.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`);

  } catch (error) {
    console.error('❌ Errore generale:', error);
  }
}

insertTodayFinancialData();

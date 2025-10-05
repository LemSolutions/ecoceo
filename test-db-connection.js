// Test script per verificare la connessione al database
const { createClient } = require('@supabase/supabase-js');

// Configurazione temporanea per il test
const supabaseUrl = 'https://your-project.supabase.co'; // Sostituire con l'URL reale
const supabaseKey = 'your-anon-key'; // Sostituire con la chiave reale

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Verifica se la tabella task_calendar_appointments esiste
    console.log('\n1. Testing task_calendar_appointments table...');
    const { data: appointments, error: appointmentsError } = await supabase
      .from('task_calendar_appointments')
      .select('*')
      .limit(1);
    
    if (appointmentsError) {
      console.error('❌ Error with task_calendar_appointments:', appointmentsError);
    } else {
      console.log('✅ task_calendar_appointments table exists');
    }
    
    // Test 2: Verifica se la tabella recurring_activities esiste
    console.log('\n2. Testing recurring_activities table...');
    const { data: activities, error: activitiesError } = await supabase
      .from('recurring_activities')
      .select('*')
      .limit(1);
    
    if (activitiesError) {
      console.error('❌ Error with recurring_activities:', activitiesError);
    } else {
      console.log('✅ recurring_activities table exists');
    }
    
    // Test 3: Verifica lo schema della tabella task_calendar_appointments
    console.log('\n3. Testing table schema...');
    const { data: schema, error: schemaError } = await supabase
      .from('task_calendar_appointments')
      .select('*')
      .limit(0);
    
    if (schemaError) {
      console.error('❌ Schema error:', schemaError);
    } else {
      console.log('✅ Schema check passed');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();

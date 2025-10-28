'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faCog, faDatabase, faKey, faGlobe } from '@fortawesome/free-solid-svg-icons';

interface EnvironmentStatus {
  supabase: boolean;
  sanity: boolean;
  stripe: boolean;
  ai: boolean;
  overall: boolean;
}

export default function EnvironmentSetup() {
  const [envStatus, setEnvStatus] = useState<EnvironmentStatus>({
    supabase: false,
    sanity: false,
    stripe: false,
    ai: false,
    overall: false
  });
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    setLoading(true);
    
    try {
      // Check Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const supabaseConfigured = !!(supabaseUrl && supabaseKey && 
        supabaseUrl !== 'your_supabase_url_here' && 
        supabaseKey !== 'your_supabase_publishable_key_here');

      // Check Sanity
      const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
      const sanityConfigured = !!(sanityProjectId && sanityDataset && 
        sanityProjectId !== 'your_sanity_project_id');

      // Check Stripe
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      const stripeConfigured = !!(stripeSecretKey && stripePublishableKey && 
        stripeSecretKey !== 'sk_test_your_stripe_secret_key_here' && 
        stripePublishableKey !== 'pk_test_your_stripe_publishable_key_here');

      // Check AI
      const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      const googleAiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
      const anthropicKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
      const aiConfigured = !!(openaiKey || googleAiKey || anthropicKey);

      const overallConfigured = supabaseConfigured && sanityConfigured && stripeConfigured;

      setEnvStatus({
        supabase: supabaseConfigured,
        sanity: sanityConfigured,
        stripe: stripeConfigured,
        ai: aiConfigured,
        overall: overallConfigured
      });

      setDetails({
        supabase: {
          url: supabaseUrl,
          key: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not set',
          configured: supabaseConfigured
        },
        sanity: {
          projectId: sanityProjectId,
          dataset: sanityDataset,
          configured: sanityConfigured
        },
        stripe: {
          secretKey: stripeSecretKey ? `${stripeSecretKey.substring(0, 20)}...` : 'Not set',
          publishableKey: stripePublishableKey ? `${stripePublishableKey.substring(0, 20)}...` : 'Not set',
          configured: stripeConfigured
        },
        ai: {
          openai: !!openaiKey,
          google: !!googleAiKey,
          anthropic: !!anthropicKey,
          configured: aiConfigured
        }
      });

    } catch (error) {
      console.error('Error checking environment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
    ) : (
      <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBg = (status: boolean) => {
    return status ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Controllo configurazione...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faCog} className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configurazione Ambiente
        </h2>
        <p className="text-gray-600">
          Verifica dello stato delle configurazioni e servizi esterni
        </p>
      </div>

      {/* Overall Status */}
      <div className={`p-6 rounded-lg border-2 ${getStatusBg(envStatus.overall)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(envStatus.overall)}
            <div>
              <h3 className={`text-lg font-semibold ${getStatusColor(envStatus.overall)}`}>
                {envStatus.overall ? 'Configurazione Completa' : 'Configurazione Incompleta'}
              </h3>
              <p className="text-sm text-gray-600">
                {envStatus.overall 
                  ? 'Tutti i servizi principali sono configurati correttamente'
                  : 'Alcuni servizi richiedono configurazione'
                }
              </p>
            </div>
          </div>
          <button
            onClick={checkEnvironment}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ricontrolla
          </button>
        </div>
      </div>

      {/* Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supabase */}
        <div className={`p-6 rounded-lg border ${getStatusBg(envStatus.supabase)}`}>
          <div className="flex items-center space-x-3 mb-4">
            <FontAwesomeIcon icon={faDatabase} className="w-6 h-6 text-blue-600" />
            <h3 className={`text-lg font-semibold ${getStatusColor(envStatus.supabase)}`}>
              Supabase Database
            </h3>
            {getStatusIcon(envStatus.supabase)}
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">URL:</span>
              <span className="ml-2 text-gray-600">
                {details.supabase?.url || 'Non configurato'}
              </span>
            </div>
            <div>
              <span className="font-medium">API Key:</span>
              <span className="ml-2 text-gray-600">
                {details.supabase?.key || 'Non configurato'}
              </span>
            </div>
          </div>
        </div>

        {/* Sanity CMS */}
        <div className={`p-6 rounded-lg border ${getStatusBg(envStatus.sanity)}`}>
          <div className="flex items-center space-x-3 mb-4">
            <FontAwesomeIcon icon={faGlobe} className="w-6 h-6 text-orange-600" />
            <h3 className={`text-lg font-semibold ${getStatusColor(envStatus.sanity)}`}>
              Sanity CMS
            </h3>
            {getStatusIcon(envStatus.sanity)}
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Project ID:</span>
              <span className="ml-2 text-gray-600">
                {details.sanity?.projectId || 'Non configurato'}
              </span>
            </div>
            <div>
              <span className="font-medium">Dataset:</span>
              <span className="ml-2 text-gray-600">
                {details.sanity?.dataset || 'Non configurato'}
              </span>
            </div>
          </div>
        </div>

        {/* Stripe */}
        <div className={`p-6 rounded-lg border ${getStatusBg(envStatus.stripe)}`}>
          <div className="flex items-center space-x-3 mb-4">
            <FontAwesomeIcon icon={faKey} className="w-6 h-6 text-purple-600" />
            <h3 className={`text-lg font-semibold ${getStatusColor(envStatus.stripe)}`}>
              Stripe Payments
            </h3>
            {getStatusIcon(envStatus.stripe)}
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Secret Key:</span>
              <span className="ml-2 text-gray-600">
                {details.stripe?.secretKey || 'Non configurato'}
              </span>
            </div>
            <div>
              <span className="font-medium">Publishable Key:</span>
              <span className="ml-2 text-gray-600">
                {details.stripe?.publishableKey || 'Non configurato'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Services */}
        <div className={`p-6 rounded-lg border ${getStatusBg(envStatus.ai)}`}>
          <div className="flex items-center space-x-3 mb-4">
            <FontAwesomeIcon icon={faCog} className="w-6 h-6 text-green-600" />
            <h3 className={`text-lg font-semibold ${getStatusColor(envStatus.ai)}`}>
              AI Services
            </h3>
            {getStatusIcon(envStatus.ai)}
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">OpenAI:</span>
              <span className={`ml-2 ${details.ai?.openai ? 'text-green-600' : 'text-gray-400'}`}>
                {details.ai?.openai ? 'Configurato' : 'Non configurato'}
              </span>
            </div>
            <div>
              <span className="font-medium">Google AI:</span>
              <span className={`ml-2 ${details.ai?.google ? 'text-green-600' : 'text-gray-400'}`}>
                {details.ai?.google ? 'Configurato' : 'Non configurato'}
              </span>
            </div>
            <div>
              <span className="font-medium">Anthropic:</span>
              <span className={`ml-2 ${details.ai?.anthropic ? 'text-green-600' : 'text-gray-400'}`}>
                {details.ai?.anthropic ? 'Configurato' : 'Non configurato'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Come Configurare i Servizi
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div>
            <strong>1. Supabase:</strong> Crea un progetto su supabase.com e aggiungi URL e API Key al file .env.local
          </div>
          <div>
            <strong>2. Sanity:</strong> Crea un progetto su sanity.io e configura Project ID e Dataset
          </div>
          <div>
            <strong>3. Stripe:</strong> Crea un account su stripe.com e ottieni le chiavi API
          </div>
          <div>
            <strong>4. AI Services:</strong> Configura almeno uno dei servizi AI per le funzionalità avanzate
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={async () => {
            try {
              const response = await fetch('/api/test-stripe');
              const data = await response.json();
              alert(`Stripe Test: ${data.status}\n${data.message}`);
            } catch (error) {
              alert('Errore nel test Stripe');
            }
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Test Stripe
        </button>
        
        <button
          onClick={async () => {
            try {
              const response = await fetch('/api/test-database');
              const data = await response.json();
              alert(`Database Test: ${data.status}\n${data.message}`);
            } catch (error) {
              alert('Errore nel test Database');
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Database
        </button>
      </div>
    </div>
  );
}
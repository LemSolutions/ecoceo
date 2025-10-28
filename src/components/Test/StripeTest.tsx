'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faShieldAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function StripeTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testStripeConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-stripe');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'Errore di connessione',
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      });
    } finally {
      setLoading(false);
    }
  };

  const testCheckoutSession = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              product: {
                title: 'Prodotto Test',
                price: 29.99,
                mainImage: 'https://via.placeholder.com/300x200'
              },
              quantity: 1
            }
          ],
          customerEmail: 'test@example.com',
          orderNumber: `TEST-${Date.now()}`
        }),
      });
      
      const data = await response.json();
      setTestResult({
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Checkout session creata con successo' : 'Errore nella creazione checkout',
        data: data
      });
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'Errore di connessione',
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faCreditCard} className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Test Stripe Payment System
        </h2>
        <p className="text-gray-600">
          Verifica della configurazione e funzionalità Stripe
        </p>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={testStripeConnection}
          disabled={loading}
          className="flex items-center justify-center space-x-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5" />
          <span>Test Connessione Stripe</span>
        </button>
        
        <button
          onClick={testCheckoutSession}
          disabled={loading}
          className="flex items-center justify-center space-x-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
          <span>Test Checkout Session</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-2">Test in corso...</p>
        </div>
      )}

      {/* Test Results */}
      {testResult && !loading && (
        <div className={`p-6 rounded-lg border-2 ${
          testResult.status === 'success' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <FontAwesomeIcon 
              icon={testResult.status === 'success' ? faCheckCircle : faShieldAlt} 
              className={`w-6 h-6 ${
                testResult.status === 'success' ? 'text-green-600' : 'text-red-600'
              }`} 
            />
            <h3 className={`text-lg font-semibold ${
              testResult.status === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {testResult.status === 'success' ? 'Test Completato' : 'Test Fallito'}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <strong>Messaggio:</strong> {testResult.message}
            </div>
            
            {testResult.error && (
              <div>
                <strong>Errore:</strong> 
                <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {testResult.error}
                </pre>
              </div>
            )}
            
            {testResult.data && (
              <div>
                <strong>Dati:</strong>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          🔒 Sicurezza Stripe
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div>✅ <strong>PCI DSS Compliant:</strong> Stripe è certificato PCI DSS Level 1</div>
          <div>✅ <strong>Crittografia SSL:</strong> Tutti i dati sono crittografati in transito</div>
          <div>✅ <strong>Tokenizzazione:</strong> I dati delle carte non vengono mai memorizzati</div>
          <div>✅ <strong>3D Secure:</strong> Autenticazione aggiuntiva per transazioni</div>
          <div>✅ <strong>Fraud Protection:</strong> Protezione automatica dalle frodi</div>
          <div>✅ <strong>GDPR Compliant:</strong> Conforme alle normative europee</div>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          💳 Metodi di Pagamento Supportati
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-800">
          <div>✅ Visa</div>
          <div>✅ Mastercard</div>
          <div>✅ American Express</div>
          <div>✅ Discover</div>
          <div>✅ Diners Club</div>
          <div>✅ JCB</div>
          <div>✅ UnionPay</div>
          <div>✅ Carte Debit</div>
        </div>
      </div>
    </div>
  );
}

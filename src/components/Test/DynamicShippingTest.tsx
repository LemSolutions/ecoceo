"use client";

import { useState } from 'react';
import { calculateDynamicShipping, getShippingInfo, calculateOrderWeight, calculateOrderDimensions } from '@/lib/dynamicShipping';

const DynamicShippingTest = () => {
  const [testData, setTestData] = useState({
    weight: 2.5,
    country: 'IT',
    orderTotal: 5000 // €50.00 in centesimi
  });

  const [results, setResults] = useState<any>(null);

  const runTest = () => {
    // Simula items per il test
    const mockItems = [{
      product: {
        weight: testData.weight * 1000, // Converti kg in grammi per Sanity
        dimensions: {
          length: 20,
          width: 15,
          height: 10
        }
      },
      quantity: 1
    }];
    
    const shipping = calculateDynamicShipping(testData.weight, testData.country, testData.orderTotal);
    const info = getShippingInfo(testData.country, testData.weight, testData.orderTotal, mockItems);
    const dimensions = calculateOrderDimensions(mockItems);
    
    setResults({
      shipping,
      info,
      dimensions,
      testData: { ...testData }
    });
  };

  const testScenarios = [
    { weight: 0.5, country: 'IT', orderTotal: 5000, name: 'Pacco leggero - Italia' },
    { weight: 5.0, country: 'IT', orderTotal: 5000, name: 'Pacco pesante - Italia' },
    { weight: 2.0, country: 'US', orderTotal: 5000, name: 'Pacco medio - USA' },
    { weight: 1.0, country: 'IT', orderTotal: 15000, name: 'Ordine grande - Italia (spedizione gratuita)' },
    { weight: 3.0, country: 'DE', orderTotal: 8000, name: 'Pacco medio - Germania' },
    { weight: 10.0, country: 'AU', orderTotal: 5000, name: 'Pacco molto pesante - Australia' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🧪 Test Calcolo Dinamico Spedizioni</h2>
      
      {/* Test Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Parametri di Test</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={testData.weight}
              onChange={(e) => setTestData({...testData, weight: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paese
            </label>
            <select
              value={testData.country}
              onChange={(e) => setTestData({...testData, country: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="IT">Italia</option>
              <option value="FR">Francia</option>
              <option value="DE">Germania</option>
              <option value="GB">Regno Unito</option>
              <option value="US">USA</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="JP">Giappone</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valore Ordine (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={testData.orderTotal / 100}
              onChange={(e) => setTestData({...testData, orderTotal: parseFloat(e.target.value) * 100})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={runTest}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Calcola Spedizione
        </button>
      </div>

      {/* Test Scenarios */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Scenari di Test Rapidi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {testScenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => {
                setTestData({
                  weight: scenario.weight,
                  country: scenario.country,
                  orderTotal: scenario.orderTotal
                });
                setTimeout(runTest, 100);
              }}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="font-medium text-sm">{scenario.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                {scenario.weight}kg • {scenario.country} • €{(scenario.orderTotal/100).toFixed(2)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Risultati Calcolo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parametri */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Parametri</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Peso:</span>
                  <span className="font-medium">{results.testData.weight}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensioni:</span>
                  <span className="font-medium">{results.dimensions.length.toFixed(1)} × {results.dimensions.width.toFixed(1)} × {results.dimensions.height.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-medium">{(results.dimensions.volume / 1000000).toFixed(2)}m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paese:</span>
                  <span className="font-medium">{results.testData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valore ordine:</span>
                  <span className="font-medium">€{(results.testData.orderTotal/100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zona:</span>
                  <span className="font-medium">{results.info.zone}</span>
                </div>
              </div>
            </div>

            {/* Tariffe */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Tariffe Spedizione</h4>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Standard</span>
                    <span className="text-lg font-bold text-blue-600">{results.info.standard.cost}</span>
                  </div>
                  <div className="text-sm text-gray-600">{results.info.standard.days}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Express</span>
                    <span className="text-lg font-bold text-green-600">{results.info.express.cost}</span>
                  </div>
                  <div className="text-sm text-gray-600">{results.info.express.days}</div>
                </div>
                {results.info.isFreeShipping && (
                  <div className="bg-green-100 p-3 rounded border border-green-300">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-800">🎉 Spedizione Gratuita!</span>
                      <span className="text-sm text-green-700">Sopra {results.info.freeShippingThreshold}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dettagli Tecnici */}
          <div className="mt-6 pt-4 border-t border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3">Dettagli Tecnici</h4>
            <div className="bg-white p-4 rounded border text-sm">
              <pre className="whitespace-pre-wrap text-xs">
{JSON.stringify(results.shipping, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Info Sistema */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Come Funziona il Sistema</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Zone di spedizione:</strong> Tariffe differenziate per area geografica</li>
          <li>• <strong>Calcolo peso:</strong> Tariffa base + (peso × moltiplicatore per kg)</li>
          <li>• <strong>Spedizione express:</strong> Moltiplicatore applicato alla tariffa standard</li>
          <li>• <strong>Spedizione gratuita:</strong> Soglie diverse per zona (€100 IT, €150 EU, €200 resto mondo)</li>
          <li>• <strong>Giorni di consegna:</strong> Calcolati in base alla distanza e tipo di spedizione</li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicShippingTest;

"use client";

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { calculateOrderWeight, getShippingInfo } from '@/lib/dynamicShipping';
import { searchCities, ItalianCity } from '@/lib/italianCities';

interface SimpleStripeCheckoutProps {
  customerEmail?: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

const SimpleStripeCheckout = ({ customerEmail, onSuccess, onError }: SimpleStripeCheckoutProps) => {
  const { state } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('IT');
  const [email, setEmail] = useState<string>(customerEmail || '');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [province, setProvince] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [citySuggestions, setCitySuggestions] = useState<ItalianCity[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Carica i dati salvati dal localStorage quando il componente si monta
  useEffect(() => {
    const savedCheckoutData = localStorage.getItem('checkoutData');
    if (savedCheckoutData) {
      try {
        const data = JSON.parse(savedCheckoutData);
        if (data.email) setEmail(data.email);
        if (data.address) setAddress(data.address);
        if (data.city) setCity(data.city);
        if (data.province) setProvince(data.province);
        if (data.postalCode) setPostalCode(data.postalCode);
        if (data.country) setSelectedCountry(data.country);
      } catch (error) {
        console.error('Error loading saved checkout data:', error);
      }
    }
  }, []);

  // Gestione suggerimenti città
  useEffect(() => {
    if (city.length >= 2) {
      const suggestions = searchCities(city);
      setCitySuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  }, [city]);

  // Chiudi suggerimenti quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (selectedCity: ItalianCity) => {
    setCity(selectedCity.name);
    setProvince(selectedCity.province);
    setPostalCode(selectedCity.postalCode);
    setShowSuggestions(false);
  };

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      setError('Il carrello è vuoto');
      return;
    }

    // Validazione campi obbligatori
    if (!email || !email.includes('@')) {
      setError('Inserisci un indirizzo email valido');
      return;
    }

    if (!address.trim()) {
      setError('Inserisci l\'indirizzo di spedizione');
      return;
    }

    if (!city.trim()) {
      setError('Inserisci la città');
      return;
    }

    if (!province.trim()) {
      setError('Inserisci la provincia');
      return;
    }

    if (!postalCode.trim()) {
      setError('Inserisci il codice postale');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Salva i dati del checkout nel localStorage prima di procedere
      const checkoutData = {
        email,
        address,
        city,
        province,
        postalCode,
        country: selectedCountry,
        items: state.items,
        total: state.total,
        timestamp: Date.now()
      };
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

      console.log('Creating checkout session with items:', state.items);
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          customerEmail: email,
          orderNumber: `ORD-${Date.now()}`,
          country: selectedCountry,
          shippingAddress: {
            address: address.trim(),
            city: city.trim(),
            province: province.trim(),
            postalCode: postalCode.trim(),
            country: selectedCountry
          }
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Stripe API response:', responseData);

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      if (responseData.url) {
        console.log('Redirecting to Stripe URL:', responseData.url);
        // Ensure we're not in an iframe and redirect to top level
        if (window.top !== window.self) {
          window.top.location.href = responseData.url;
        } else {
          window.location.href = responseData.url;
        }
      } else if (responseData.sessionId) {
        // Fallback: use Stripe.js redirect
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        
        if (stripe) {
          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId: responseData.sessionId,
          });

          if (stripeError) {
            throw new Error(stripeError.message);
          }
        } else {
          throw new Error('Stripe non caricato');
        }
      } else {
        throw new Error('Nessun URL o Session ID ricevuto da Stripe');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il checkout';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const packagingFee = Math.max(state.total * 0.005, 2); // 0.5% with minimum €2
  const total = state.total + packagingFee; // Add packaging fee
  
  // Calculate shipping info for display based on selected country
  const orderWeight = calculateOrderWeight(state.items);
  const shippingInfo = getShippingInfo(selectedCountry, orderWeight, state.total * 100, state.items); // Convert to cents
  
  // Lista dei paesi disponibili
  const countries = [
    { code: 'IT', name: 'Italia' },
    { code: 'FR', name: 'Francia' },
    { code: 'DE', name: 'Germania' },
    { code: 'ES', name: 'Spagna' },
    { code: 'AT', name: 'Austria' },
    { code: 'CH', name: 'Svizzera' },
    { code: 'BE', name: 'Belgio' },
    { code: 'NL', name: 'Paesi Bassi' },
    { code: 'LU', name: 'Lussemburgo' },
    { code: 'GB', name: 'Regno Unito' },
    { code: 'IE', name: 'Irlanda' },
    { code: 'US', name: 'Stati Uniti' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'NZ', name: 'Nuova Zelanda' },
    { code: 'JP', name: 'Giappone' },
    { code: 'KR', name: 'Corea del Sud' },
    { code: 'SG', name: 'Singapore' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'BR', name: 'Brasile' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CL', name: 'Cile' },
    { code: 'MX', name: 'Messico' },
  ];

  return (
    <>
      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Errore Checkout</h3>
            </div>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Checkout Sicuro con Stripe
          </h3>
          <p className="text-gray-600">
            Verrai reindirizzato alla pagina di pagamento sicura di Stripe
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-blue-500/20 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">Riepilogo Ordine</h4>
          <div className="space-y-3">
            {state.items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">IMG</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">€{((item.product.price.unit_amount / 100) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotale:</span>
                <span>€{state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spese di imballo:</span>
                <span>€{Math.max(state.total * 0.005, 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t">
                <span>Totale:</span>
                <span className="text-primary">€{(state.total + Math.max(state.total * 0.005, 2)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Form */}
        <div className="bg-white/50 border border-gray-200 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">Informazioni di Spedizione</h4>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                placeholder="tua.email@esempio.com"
              />
            </div>

            {/* Indirizzo */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Indirizzo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                placeholder="Via, numero civico"
              />
            </div>

            {/* Città con autocomplete */}
            <div className="relative">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Città <span className="text-red-500">*</span>
              </label>
              <input
                ref={cityInputRef}
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onFocus={() => {
                  if (city.length >= 2 && citySuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                placeholder="Inizia a digitare la città (es: Monza, Brugherio...)"
                autoComplete="off"
              />
              {/* Suggerimenti città */}
              {showSuggestions && citySuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                  {citySuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleCitySelect(suggestion)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{suggestion.name}</div>
                      <div className="text-sm text-gray-600">
                        {suggestion.province} ({suggestion.provinceCode}) - {suggestion.postalCode}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Provincia e CAP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                  Provincia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                  placeholder="Provincia (es: Monza e Brianza)"
                  readOnly={!!citySuggestions.find(c => c.name === city)}
                />
              </div>
              <div>
                <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-2">
                  CAP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postal-code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                  placeholder="CAP"
                  readOnly={!!citySuggestions.find(c => c.name === city)}
                />
              </div>
            </div>

            {/* Paese */}
            <div>
              <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-2">
                Paese <span className="text-red-500">*</span>
              </label>
              <select
                id="country-select"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-gray-900 mb-3">Dettagli Spedizione</h4>
          <div className="space-y-2 text-sm">
            
            <div className="flex justify-between">
              <span className="text-gray-600">Peso totale:</span>
              <span className="font-medium">{shippingInfo.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dimensioni:</span>
              <span className="font-medium">{shippingInfo.dimensions.length} × {shippingInfo.dimensions.width} × {shippingInfo.dimensions.height}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Volume:</span>
              <span className="font-medium">{shippingInfo.dimensions.volume}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Zona di spedizione:</span>
              <span className="font-medium">{shippingInfo.zone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Spedizione standard:</span>
              <span className="font-medium">{shippingInfo.standard.cost} ({shippingInfo.standard.days})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Spedizione express:</span>
              <span className="font-medium">{shippingInfo.express.cost} ({shippingInfo.express.days})</span>
            </div>
            {shippingInfo.isFreeShipping && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>🎉 Spedizione gratuita!</span>
                <span>Ordine sopra {shippingInfo.freeShippingThreshold}</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h5 className="text-sm font-medium text-blue-900">Pagamento Sicuro</h5>
              <p className="text-sm text-blue-700 mt-1">
                I tuoi dati di pagamento sono protetti da crittografia SSL e conformi agli standard PCI DSS.
              </p>
            </div>
          </div>
        </div>


        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading || state.items.length === 0}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${
            isLoading || state.items.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Reindirizzamento...
            </span>
          ) : (
            `Paga €${total.toFixed(2)} con Stripe`
          )}
        </button>

        {/* Payment Methods */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Metodi di pagamento accettati:</p>
          <div className="flex justify-center space-x-4">
            <div key="visa" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-xs text-gray-500">Visa</span>
            </div>
            <div key="mastercard" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-xs text-gray-500">Mastercard</span>
            </div>
            <div key="amex" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-xs text-gray-500">American Express</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleStripeCheckout;

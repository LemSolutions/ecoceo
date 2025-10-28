"use client";

import { useState } from 'react';
import { useStripeProducts } from '@/hooks/useStripeProducts';
import { StripeProductWithPrice } from '@/types/stripeProduct';

const StripeProductTest = () => {
  const { products, loading, error, refetch } = useStripeProducts();
  const [selectedProduct, setSelectedProduct] = useState<StripeProductWithPrice | null>(null);

  const formatPrice = (priceInCents: number) => {
    const priceInEuros = priceInCents / 100;
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(priceInEuros);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Caricamento prodotti...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Errore</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Test Prodotti Stripe</h2>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          Aggiorna
        </button>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">
          Trovati <span className="font-semibold">{products.length}</span> prodotti
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun prodotto trovato</h3>
          <p className="text-gray-600">Non ci sono prodotti attivi su Stripe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedProduct?.id === product.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.metadata.shortDescription || product.description || 'Nessuna descrizione'}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.price.unit_amount)}
                </span>
                {product.featured && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    In Evidenza
                  </span>
                )}
              </div>
              
              {product.category && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {product.category}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dettagli Prodotto Selezionato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="font-mono text-sm">{selectedProduct.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="font-medium">{selectedProduct.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prezzo</p>
              <p className="font-medium">{formatPrice(selectedProduct.price.unit_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Categoria</p>
              <p className="font-medium">{selectedProduct.category || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">In Evidenza</p>
              <p className="font-medium">{selectedProduct.featured ? 'Sì' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock</p>
              <p className="font-medium">{selectedProduct.stock || 'Illimitato'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Descrizione</p>
              <p className="text-sm">{selectedProduct.description || 'Nessuna descrizione'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Metadati</p>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(selectedProduct.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StripeProductTest;

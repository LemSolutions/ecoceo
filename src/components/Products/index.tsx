"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useStripeProducts } from '@/hooks/useStripeProducts';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import { useCart } from '@/contexts/CartContext';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useRouter } from 'next/navigation';

const Products = () => {
  // Carica tutti i prodotti dallo shop (non solo featured)
  const { products, loading, error } = useStripeProducts();
  const { getComponent } = useSanityUIComponents();
  const { addItem } = useCart();
  const router = useRouter();
  const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set());

  // Get UI components for Products section
  const productCardComponent = getComponent('ProductCard');
  const productTitleComponent = getComponent('ProductTitle');
  const productDescriptionComponent = getComponent('ProductDescription');

  // Funzione per aggiungere al carrello
  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingProducts(prev => new Set(prev).add(product.id));
    try {
      addItem(product, 1);
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setAddingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  // Debug: log dei prodotti caricati
  console.log('Products loaded:', products);
  console.log('Loading:', loading);
  console.log('Error:', error);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-white/80 text-lg">Caricamento prodotti...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">Errore nel caricamento</h3>
        <p className="text-white/80 mb-6">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-white mb-4">Nessun prodotto disponibile</h3>
        <p className="text-white/80 mb-6">Al momento non ci sono prodotti disponibili nello shop.</p>
        <Link
          href="/shop"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-white/90 transition"
        >
          Vai allo Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {products.slice(0, 3).map((product, index) => (
        <SanityStyledComponent
          key={product.id}
          component={productCardComponent}
          componentName="ProductCard"
          className="w-full"
        >
          <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
            <div className="group relative overflow-hidden rounded-lg bg-white/30 backdrop-blur/30 backdrop-blurshadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark h-full">
              <div className="p-8">
                {/* Product Image */}
                <div className="mb-6 relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950">
                  <Image
                    src={product.images?.[0] || "/api/placeholder/300/200"}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.category && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.category}
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                
                {/* Product Title */}
                <SanityStyledComponent
                  component={productTitleComponent}
                  componentName="ProductTitle"
                  as="h3"
                  className="mb-4 text-xl font-bold text-dark dark:text-white"
                >
                  {product.name}
                </SanityStyledComponent>
                
                {/* Product Description */}
                <SanityStyledComponent
                  component={productDescriptionComponent}
                  componentName="ProductDescription"
                  as="p"
                  className="mb-6 text-base text-body-color dark:text-body-color-dark leading-relaxed"
                >
                  {product.metadata?.shortDescription || product.description || "Prodotto di qualità premium"}
                </SanityStyledComponent>

                {/* Product Metadata */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    {product.metadata?.weight && (
                      <li className="flex items-center text-sm text-body-color dark:text-body-color-dark">
                        <svg
                          className="mr-2 h-4 w-4 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Peso: {product.metadata.weight}
                      </li>
                    )}
                    {product.metadata?.dimensions && (
                      <li className="flex items-center text-sm text-body-color dark:text-body-color-dark">
                        <svg
                          className="mr-2 h-4 w-4 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Dimensioni: {product.metadata.dimensions}
                      </li>
                    )}
                    {product.stock !== undefined && (
                      <li className="flex items-center text-sm text-body-color dark:text-body-color-dark">
                        <svg
                          className="mr-2 h-4 w-4 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Disponibili: {product.stock} pezzi
                      </li>
                    )}
                  </ul>
                </div>

                {/* Price and CTA */}
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-primary text-center">
                    €{(product.price.unit_amount / 100).toFixed(2)}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addingProducts.has(product.id)}
                      className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg transition-colors duration-200 group ${
                        addingProducts.has(product.id)
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {addingProducts.has(product.id) ? (
                        <>
                          <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Aggiungendo...
                        </>
                      ) : (
                        <>
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                            />
                          </svg>
                          Aggiungi al Carrello
                        </>
                      )}
                    </button>
                    
                <Link
                  href="/shop"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition-colors duration-200 group"
                >
                      Vai allo Shop
                      <svg
                        className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SanityStyledComponent>
      ))}
    </div>
  );
};

export default Products;
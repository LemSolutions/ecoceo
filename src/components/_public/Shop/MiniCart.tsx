"use client";

import { useCart } from '@/contexts/CartContext';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const MiniCart = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Block body scroll when cart is open on mobile
  useEffect(() => {
    if (isOpen) {
      // Block scroll on mobile
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="relative" ref={cartRef}>
      {/* Cart Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center p-2 text-white hover:text-orange-300 transition-colors"
      >
        <svg 
          className="w-6 h-6" 
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
        
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {state.itemCount > 99 ? '99+' : state.itemCount}
          </span>
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mini Cart Dropdown - Desktop & Mobile */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-md shadow-xl z-50 flex flex-col lg:absolute lg:top-auto lg:h-auto lg:mt-2 lg:w-80 lg:rounded-lg lg:flex-none border border-gray-200 overflow-hidden">
          <div className="p-4 flex-1 flex flex-col overflow-y-auto lg:overflow-visible lg:flex-none min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">
                Carrello ({state.itemCount})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {state.items.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <p className="text-gray-500">Il carrello è vuoto</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0 lg:max-h-64">
                  {state.items.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg">
                      <img
                        src={getImageUrl(item.product.mainImage)}
                        alt={getTextValue(item.product.title)}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-black truncate">
                          {getTextValue(item.product.title)}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {formatPrice(item.product.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Total */}
                <div className="border-t pt-4 mb-4 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-black">Totale:</span>
                    <span className="font-bold text-primary">{formatPrice(state.total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 flex-shrink-0">
                  <Link
                    href="/shop/cart"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center block"
                  >
                    Vedi Carrello
                  </Link>
                  <Link
                    href="/shop/checkout"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center block"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;

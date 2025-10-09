'use client';

import { useState } from 'react';
import { useClientDate } from '../../hooks/useClientDate';
import HomeButton from '../Navigation/HomeButton';

interface LoginFormProps {
  onLogin: (password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export default function LoginForm({ onLogin, isLoading = false, error }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { getCurrentDate } = useClientDate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onLogin(password);
    }
  };

  return (
    <div className="min-h-screen r from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl text-white">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Access</h1>
          <p className="text-gray-600">Inserisci la password per accedere al sistema</p>
          <div className="text-sm text-gray-500 mt-2">
            {getCurrentDate()}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Inserisci la password"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/30 backdrop-blur/30 backdrop-blurtext-gray-900 font-medium placeholder-gray-500"
                  disabled={isLoading}
                  autoComplete="current-password"
                  style={{ color: '#111827' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 p-1 rounded transition-colors"
                  disabled={isLoading}
                  title={showPassword ? 'Nascondi password' : 'Mostra password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-red-500 mr-2">❌</span>
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-sm text-red-600 mb-2">
                    Non hai accesso? Richiedi le credenziali a:
                  </p>
                  <a 
                    href="mailto:commerciale@lemsolutions.it?subject=Richiesta accesso Dashboard"
                    className="inline-flex items-center text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    commerciale@lemsolutions.it
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  Accesso in corso...
                </span>
              ) : (
                '🔓 Accedi alla Dashboard'
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                <span className="mr-2">🛡️</span>
                Accesso Sicuro
              </div>
              <p className="text-xs text-gray-400">
                La tua sessione è protetta con crittografia avanzata
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="mb-4">
            <HomeButton />
          </div>
          <p className="text-sm text-gray-500">
            © 2024 Dashboard Management System
          </p>
        </div>
      </div>
    </div>
  );
}

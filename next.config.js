/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ottimizzazioni per il build
  experimental: {
    optimizePackageImports: [
      '@sanity/image-url', 
      'next-sanity',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'chart.js',
      'react-chartjs-2',
      '@fortawesome/fontawesome-svg-core'
    ],
  },
  
  // Compressione e ottimizzazioni
  compress: true,
  
  // Headers per fixare i problemi di permissions policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'payment=*'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ],
      },
    ];
  },
  
  // Disabilita temporaneamente alcune regole ESLint per il build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disabilita TypeScript checking durante il build per velocizzare il deploy
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ottimizzazioni per le immagini
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
        port: "",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 anno per cache migliorata
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Ottimizzazioni per il bundle
  webpack: (config, { dev, isServer }) => {
    // Ottimizzazioni solo per il build di produzione
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 30,
        minSize: 15000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          // React e React-DOM chunk separato (priorità massima)
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Next.js framework chunk separato
          framework: {
            test: /[\\/]node_modules[\\/](next|@next)[\\/]/,
            name: 'next-framework',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Three.js chunk separato (libreria pesante)
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'threejs',
            chunks: 'async',
            priority: 22,
            reuseExistingChunk: true,
          },
          // Stripe chunk separato
          stripe: {
            test: /[\\/]node_modules[\\/]@stripe[\\/]/,
            name: 'stripe',
            chunks: 'async',
            priority: 22,
            reuseExistingChunk: true,
          },
          // Chart.js chunk separato
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            name: 'charts',
            chunks: 'async',
            priority: 22,
            reuseExistingChunk: true,
          },
          // Sanity chunk separato
          sanity: {
            test: /[\\/]node_modules[\\/]@sanity[\\/]/,
            name: 'sanity',
            chunks: 'async',
            priority: 18,
            reuseExistingChunk: true,
          },
          // Styled-components chunk separato
          styled: {
            test: /[\\/]node_modules[\\/]styled-components[\\/]/,
            name: 'styled-components',
            chunks: 'async',
            priority: 18,
            reuseExistingChunk: true,
          },
          // Supabase chunk separato
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'async',
            priority: 18,
            reuseExistingChunk: true,
          },
          // Dashboard chunk separato
          dashboard: {
            test: /[\\/]app[\\/]\(dashboard\)[\\/]|[\\/]components[\\/]Dashboard[\\/]/,
            name: 'dashboard',
            chunks: 'async',
            priority: 12,
            reuseExistingChunk: true,
          },
          // FontAwesome chunk separato
          fontawesome: {
            test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
            name: 'fontawesome',
            chunks: 'async',
            priority: 18,
            reuseExistingChunk: true,
          },
          // Vendor comune (librerie piccole - diviso in chunk più piccoli)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: (module) => {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
              if (packageName) {
                return `vendor-${packageName.replace('@', '').replace('/', '-')}`;
              }
              return 'vendor';
            },
            chunks: 'async',
            priority: 5,
            minChunks: 1,
            reuseExistingChunk: true,
            maxSize: 150000,
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;

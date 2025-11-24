import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      react({
        fastRefresh: !isProduction,
        babel: isProduction
          ? {
              plugins: [
                ['transform-remove-console', { exclude: ['error', 'warn'] }]
              ]
            }
          : {}
      })
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@services': path.resolve(__dirname, './src/services'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@store': path.resolve(__dirname, './src/store')
      }
    },

    server: {
      port: 3000,
      host: true,
      cors: true,
      open: true,
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL ?? 'https://immo360-auth-service.onrender.com',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, '/api')
        }
      }
    },

    preview: {
      port: 4173,
      host: true,
      open: true
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,

      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.info', 'console.debug'],
              passes: 2
            },
            mangle: { safari10: true },
            format: { comments: false }
          }
        : {},

      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            if (!name) return 'assets/[name]-[hash][extname]'
            
            const ext = name.split('.').pop()

            if (/png|jpe?g|svg|gif|bmp|ico/i.test(ext))
              return 'assets/images/[name]-[hash][extname]'

            if (/woff|woff2|eot|ttf|otf/i.test(ext))
              return 'assets/fonts/[name]-[hash][extname]'

            return `assets/${ext}/[name]-[hash][extname]`
          },

          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) 
              return 'react-vendor'
            
            if (id.includes('node_modules/react-router-dom')) 
              return 'router-vendor'
            
            if (id.includes('@mui') || id.includes('@emotion')) 
              return 'ui-vendor'
            
            if (id.includes('node_modules')) 
              return 'vendor'
          }
        }
      },

      reportCompressedSize: isProduction,
      cssCodeSplit: true,
      cssMinify: isProduction,
      modulePreload: {
        polyfill: true
      },
      target: 'es2020'
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      force: false
    },

    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isProduction
          ? '[hash:base64:8]'
          : '[name]__[local]__[hash:base64:5]'
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      },
      devSourcemap: !isProduction
    },

    envPrefix: 'VITE_',
    base: '/',
    publicDir: 'public',
    clearScreen: false,
    logLevel: isProduction ? 'info' : 'warn'
  }
})
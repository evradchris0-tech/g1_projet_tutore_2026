import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy pour l'API User Management (users, buildings, equipments, incidents)
        // /api-users/users -> https://users-api.../users
        '/api-users': {
          target: env.VITE_API_BASE_URL_FOR_USER_MANAGEMENT || 'https://users-api-llry.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-users/, ''),
          secure: true
        },
        // Proxy pour l'API Auth
        // /api-auth/auth/login -> https://auth-api.../auth/login
        '/api-auth': {
          target: env.VITE_API_BASE_URL_FOR_AUTH || 'https://auth-api-qwt5.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-auth/, ''),
          secure: true
        }
      }
    }
  }
})


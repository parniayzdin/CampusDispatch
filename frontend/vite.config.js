import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isProd = process.env.NODE_ENV === 'production'

// NOTE: keeping this simple on purpose. we can add tsconfig paths, svgr, etc later.
export default defineConfig({
  plugins: [react()],

  // base path for prod builds; change if you deploy under a subfolder
  base: '/',

  server: {
    port: 5173,            // frontend runs here
    strictPort: true,      // fail instead of auto-picking a new port (nice for muscle memory)
    open: true,            // auto-open browser on dev start (can turn off if annoying)
    // CORS is generally fine; proxy takes care of cross-origin during dev
    cors: true,

    // you can hit /api/... from the frontend and it forwards to FastAPI
    proxy: {
      // TODO: switch to env var later if you want (e.g. process.env.VITE_API_URL)
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // uncomment if backend has no /api prefix
      },
    },
  },

  preview: {
    port: 4173,
    open: false, // i’ll leave this off for preview to avoid surprise tabs
  },

  // nice to have in dev; in prod you might turn off sourcemaps to keep bundles smaller
  build: {
    sourcemap: !isProd ? 'inline' : false, // we can tweak this later
    outDir: 'dist',
    emptyOutDir: true,
  },

  // resolve aliases if you add them (we can wire @ to /src later)
  // resolve: {
  //   alias: {
  //     '@': '/src',
  //   },
  // },

  // speed-ups (vite pre-bundles these). add libs here if cold-start gets slow
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios'],
  },

  // where to read env files from (optional). leaving default for now.
  // envDir: process.cwd(),

  // define globals if you need quick feature flags
  define: {
    __APP_NAME__: JSON.stringify('CampusDispatch Lite'), // just for fun, we can read this in the UI later
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    /* PERF: Manual chunk splitting — separates heavy libraries into
       their own cached bundles. Users download Three.js/Framer Motion
       only once and browser caches them across navigations */
    rollupOptions: {
      output: {
        manualChunks: {
          /* Three.js + Drei are ~500KB — isolate so landing page
             doesn't block on parsing them until CategoriesSection loads */
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          /* Framer Motion is ~120KB — separate from main bundle */
          'framer-motion': ['framer-motion'],
          /* Redux/React-Redux — shared across pages, cache separately */
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          /* Router — loaded on every page, cache independently */
          'router': ['react-router-dom'],
        },
      },
    },
    /* Increase chunk warning to avoid noise from Three.js */
    chunkSizeWarningLimit: 600,
  },
})

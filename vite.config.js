import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tailwindScrollbarHide from 'tailwind-scrollbar-hide'; // Import the plugin


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server:{
    proxy: {
      '/api': {
          target: 'https://netflix-back-1.onrender.com',
          changeOrigin: true,
        secure: false,
          
      },
  }
  
  }
})

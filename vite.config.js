import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    allowedHosts: [
      'ungossiping-unflounced-sullivan.ngrok-free.dev' 
    ],
    host: true, // optional, ensures external access (like from your phone)
    port: 5173, // or whatever port you’re using
  }
})

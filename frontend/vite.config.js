import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    allowedHosts: ['.ngrok-free.app'], // Allow all ngrok subdomains
    host: true, // Allow external access
    port: 3000, // Ensure it's running on the right port
  }
})

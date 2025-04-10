import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss({
      config: {
        darkMode: 'class',
        content: ['./src/**/*.{js,jsx,ts,tsx}'],
        theme: {
          extend: {
            colors: {
              'applied': '#60a5fa',
              'interview': '#fbbf24',
              'offer': '#34d399',
              'rejected': '#ef4444'
            },
          },
        },
        plugins: [],
      },
    })
  ],
})

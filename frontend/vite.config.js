import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The shared /assets folder (Pappu, doodles, project images, video, GLB avatar)
// lives OUTSIDE the frontend folder, so we tell Vite to serve it as the
// "public" directory. That means  assets/pappu/pappu-hi.png  is available
// in the browser at  /pappu/pappu-hi.png  — and it is copied into the build.
export default defineConfig({
  plugins: [react()],
  publicDir: '../assets',
  server: {
    port: 5173,
    // During development, forward /api/... calls to the FastAPI backend
    proxy: { '/api': 'http://localhost:8000' },
  },
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: false,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'mahesh-portfolio-00r8.onrender.com',
      '.gwc-sys.online',
    ],
  },
});


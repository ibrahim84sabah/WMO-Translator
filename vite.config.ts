import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Use '.' instead of process.cwd() to prevent type errors.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for compatibility.
      // We check env.API_KEY (loaded from .env), process.env.API_KEY (system env), and env.VITE_API_KEY.
      // We default to '' to prevent 'process is not defined' runtime errors if the key is missing.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || env.VITE_API_KEY || ''),
    },
  };
});
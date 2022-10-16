import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'dist',
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    reactRefresh(),
  ],
})
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Root-relative assets keep client-side routes working on localhost, AWS and Hostinger.
  // Use the dedicated mode only when publishing beneath the GitHub repository path.
  base: mode === "github-pages" ? "/amsun-technology-website/" : "/",
}));

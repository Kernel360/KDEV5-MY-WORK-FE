// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(), // React 기본 플러그인
    svgr(), // SVG → React 컴포넌트로 import 가능
  ],
  server: {
    port: 3000, // 개발 서버 포트 (원하면 변경)
    open: true, // dev 서버 실행 시 브라우저 자동 오픈
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

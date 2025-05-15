// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// tsconfigPaths는 TS 쓸 때만 필요하므로 JS에서는 제외
// import tsconfigPaths from 'vite-tsconfig-paths';

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
      // 경로 별칭 예시
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@assets": "/src/assets",
    },
  },
});

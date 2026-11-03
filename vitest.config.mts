import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // tsconfig.json의 paths(@components, @hooks, @icons24 등)를 그대로 읽습니다. alias를 따로 적을 필요가 없습니다.
  plugins: [tsconfigPaths(), react()],
  test: {
    // 기본은 브라우저 환경(jsdom)입니다. 서버 코드(middleware 등)는 파일 맨 위에 `// @vitest-environment node`를 적습니다.
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // 날짜 유틸이 한국 시간 기준이라, 실행하는 PC의 시간대와 상관없이 결과가 같도록 고정합니다.
    env: { TZ: "Asia/Seoul" },
    restoreMocks: true,
  },
});

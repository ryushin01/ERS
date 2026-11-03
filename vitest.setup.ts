import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// toBeInTheDocument, toBeDisabled 같은 DOM 전용 matcher를 추가합니다.
import "@testing-library/jest-dom/vitest";

// globals 옵션을 쓰지 않으므로, 테스트마다 렌더링한 컴포넌트를 직접 정리합니다.
afterEach(() => {
  cleanup();
});

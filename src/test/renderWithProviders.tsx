import { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { createStore, Provider as JotaiProvider } from "jotai";
import { vi } from "vitest";

/*
 * 화면 컴포넌트를 실제 데이터 흐름(TanStack Query → services → axios → 데모 목업 어댑터)으로 렌더링하는 테스트 도우미입니다.
 * - 브라우저 전용 API(matchMedia)는 PC 화면 기준으로 채웁니다.
 * - next/navigation은 각 테스트 파일에서 vi.mock으로 대신합니다.
 */

/** PC(1440px) 화면처럼 동작하는 matchMedia (react-responsive용) */
export function mockDesktopMatchMedia() {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: /orientation: landscape/.test(query),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const store = createStore();

  return render(
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>{ui}</JotaiProvider>
    </QueryClientProvider>,
  );
}

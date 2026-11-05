import { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider as JotaiProvider } from "jotai";
import { vi } from "vitest";

/*
 * 화면 컴포넌트를 실제 데이터 흐름(TanStack Query → services → axios → 데모 목업 어댑터)으로 렌더링하는 테스트 도우미입니다.
 * - 브라우저 전용 API(matchMedia)는 PC 화면 기준으로 채웁니다.
 * - next/navigation은 각 테스트 파일에서 vi.mock으로 대신합니다.
 */

/** PC(1440px) 화면처럼 동작하는 matchMedia (useResponsive용) */
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

/**
 * 날짜 선택기(react-datepicker)에서 이번 달의 선택 가능한 날짜를 골라, 입력된 날짜를 YYYYMMDD로 돌려줍니다.
 * 지난 날짜를 막는 선택기도 있어서 고정 날짜 대신 nth번째 선택 가능한 날짜를 고르고, 실제 입력값을 기준으로 비교합니다.
 */
export async function pickAvailableDay(input: HTMLInputElement, nth = 0) {
  await userEvent.click(input);
  const days = document.querySelectorAll<HTMLElement>(
    ".react-datepicker__day:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month)",
  );
  await userEvent.click(days[Math.min(nth, days.length - 1)]);
  // 입력칸 표시 형식: YYYY.MM.DD
  return input.value.replace(/\D/g, "");
}

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useResponsive, { MOBILE_QUERY, TABLET_QUERY } from "./useResponsive";

/** 지정한 쿼리만 일치하는 matchMedia. change 이벤트를 직접 발생시킬 수 있습니다. */
function mockMatchMedia(initialMatches: string[]) {
  const matches = new Set(initialMatches);
  const listeners = new Map<string, Set<() => void>>();

  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() {
      return matches.has(query);
    },
    media: query,
    addEventListener: (_: string, listener: () => void) => {
      if (!listeners.has(query)) listeners.set(query, new Set());
      listeners.get(query)!.add(listener);
    },
    removeEventListener: (_: string, listener: () => void) =>
      listeners.get(query)?.delete(listener),
  }));

  return {
    /** 화면 크기가 바뀐 것처럼 일치하는 쿼리를 바꾸고 change 이벤트를 보냅니다. */
    change(nextMatches: string[]) {
      const changed = new Set([...matches, ...nextMatches]);
      matches.clear();
      nextMatches.forEach((query) => matches.add(query));
      changed.forEach((query) => listeners.get(query)?.forEach((listener) => listener()));
    },
  };
}

describe("useResponsive", () => {
  it("모바일 화면이면 첫 렌더링부터 모바일로 판단한다 (PC 레이아웃 깜빡임 없음)", () => {
    mockMatchMedia([MOBILE_QUERY, "(orientation: portrait)"]);
    const renders: boolean[] = [];

    renderHook(() => {
      const result = useResponsive();
      renders.push(result.isDesktop);
      return result;
    });

    expect(renders.every((isDesktop) => isDesktop === false)).toBe(true);
  });

  it.each([
    [[MOBILE_QUERY], { isMobile: true, isTablet: false, isDesktop: false }],
    [[TABLET_QUERY], { isMobile: false, isTablet: true, isDesktop: false }],
    [[], { isMobile: false, isTablet: false, isDesktop: true }],
  ])("일치하는 쿼리 %j → %j", (queries, expected) => {
    mockMatchMedia(queries);
    const { result } = renderHook(() => useResponsive());
    expect(result.current).toMatchObject(expected);
  });

  it("화면 크기가 바뀌면 다시 판단한다", () => {
    const media = mockMatchMedia([]);
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isDesktop).toBe(true);

    act(() => media.change([MOBILE_QUERY]));
    expect(result.current).toMatchObject({ isMobile: true, isDesktop: false });

    act(() => media.change([TABLET_QUERY]));
    expect(result.current).toMatchObject({ isTablet: true, isMobile: false, isDesktop: false });
  });
});

import { createStore } from "jotai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { toastState } from "./toastStore";

describe("toastState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("토스트를 띄우고 3초 뒤에 닫는다", () => {
    const store = createStore();
    const afterFunc = vi.fn();

    store.set(toastState, { message: "저장했습니다.", position: "top", afterFunc });
    expect(store.get(toastState)).toMatchObject({ isOpen: true, message: "저장했습니다." });

    vi.advanceTimersByTime(2999);
    expect(store.get(toastState).isOpen).toBe(true);
    expect(afterFunc).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(store.get(toastState).isOpen).toBe(false);
    expect(afterFunc).toHaveBeenCalledOnce();
  });

  // 재발 방지: 이전에는 앞 토스트의 타이머가 뒤 토스트를 일찍 닫았습니다.
  it("연달아 띄우면 앞 토스트의 타이머가 뒤 토스트를 닫지 않는다", () => {
    const store = createStore();

    store.set(toastState, { message: "첫 번째", position: "top" });
    vi.advanceTimersByTime(2000);
    store.set(toastState, { message: "두 번째", position: "bottom" });

    // 첫 번째 토스트의 타이머가 끝나는 시점 (두 번째는 1초 지남)
    vi.advanceTimersByTime(1000);
    expect(store.get(toastState)).toMatchObject({ isOpen: true, message: "두 번째" });

    // 두 번째 토스트의 타이머가 끝나는 시점
    vi.advanceTimersByTime(2000);
    expect(store.get(toastState).isOpen).toBe(false);
  });
});

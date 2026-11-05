import { useState } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useAdjustState from "./useAdjustState";

describe("useAdjustState", () => {
  it("첫 렌더링에 한 번 실행하고, 값이 같으면 다시 실행하지 않는다", () => {
    const adjust = vi.fn();
    const { rerender } = renderHook(() => useAdjustState(["a", 1], adjust));
    expect(adjust).toHaveBeenCalledOnce();
    rerender();
    expect(adjust).toHaveBeenCalledOnce();
  });

  it("값이 바뀌면 옛 상태를 커밋하기 전에 상태를 맞춘다", () => {
    const seen: number[] = [];
    const { rerender, result } = renderHook(
      ({ tab }) => {
        const [page, setPage] = useState(3);
        useAdjustState([tab], () => setPage(1));
        seen.push(page);
        return page;
      },
      { initialProps: { tab: "a" } },
    );
    expect(result.current).toBe(1);
    rerender({ tab: "b" });
    expect(result.current).toBe(1);
  });
});

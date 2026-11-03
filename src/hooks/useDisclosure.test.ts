import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useDisclosure from "./useDisclosure";

describe("useDisclosure", () => {
  it("닫힌 상태로 시작한다", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it("open, close, toggle로 상태를 바꾼다", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });
});

import { ChangeEvent } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useRadio from "./useRadio";

const changeEvent = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe("useRadio", () => {
  it("초기값으로 시작한다", () => {
    const { result } = renderHook(() => useRadio("00"));
    expect(result.current[0]).toBe("00");
  });

  it("선택한 radio의 value로 바뀐다", () => {
    const { result } = renderHook(() => useRadio("00"));

    act(() => result.current[1](changeEvent("20")));
    expect(result.current[0]).toBe("20");
  });
});

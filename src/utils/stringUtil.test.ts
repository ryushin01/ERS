import { describe, expect, it } from "vitest";

import { formatNumberComma, getDetailAddress, getManagerInfo } from "./stringUtil";

describe("getManagerInfo", () => {
  it("이름과 연락처를 함께 표시한다", () => {
    expect(getManagerInfo("홍길동", "010-0000-0000")).toBe("홍길동 (010-0000-0000)");
  });

  it("값이 하나만 있으면 그 값만 표시한다", () => {
    expect(getManagerInfo("홍길동")).toBe("홍길동");
    expect(getManagerInfo("", "010-0000-0000")).toBe(" (010-0000-0000)");
  });

  it("둘 다 없으면 -를 표시한다", () => {
    expect(getManagerInfo()).toBe("-");
  });
});

describe("getDetailAddress", () => {
  it("동과 호를 함께 표시한다", () => {
    expect(getDetailAddress("101", "1001")).toBe("101동 1001호");
  });

  it("값이 하나만 있으면 그 값만 표시한다", () => {
    expect(getDetailAddress("101")).toBe("101동 ");
    expect(getDetailAddress("", "1001")).toBe("1001호");
  });

  it("둘 다 없으면 -를 표시한다", () => {
    expect(getDetailAddress()).toBe("-");
  });
});

describe("formatNumberComma", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1000, "1,000"],
    [1234567, "1,234,567"],
    [-1234567, "-1,234,567"],
  ])("%d → %s", (num, expected) => {
    expect(formatNumberComma(num)).toBe(expected);
  });

  it.each([null, undefined])("%s이면 빈 문자열", (num) => {
    expect(formatNumberComma(num)).toBe("");
  });
});

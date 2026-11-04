import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { formatAmountInput, isValidAmount, MAX_AMOUNT_DIGITS, parseAmount } from "./amountUtil";

/* 콤마 형식의 금액 (빈 문자열 또는 1,234,567처럼 세 자리마다 콤마) */
const AMOUNT_FORMAT = /^(?:|0|[1-9]\d{0,2}(?:,\d{3})*)$/;

describe("금액 입력 처리 - 예시", () => {
  it.each([
    ["1234567", "1,234,567", 1234567],
    ["1,234,567", "1,234,567", 1234567],
    ["300000000", "300,000,000", 300000000],
    ["000123", "123", 123],
    ["0", "0", 0],
    ["", "", 0],
    // 원 단위 정수만: 부호·소수점·문자는 무시
    ["-1000", "1,000", 1000],
    ["1.5", "15", 15],
    ["1억", "1", 1],
    ["abc", "", 0],
  ])("입력 %j → 표시 %j, 값 %d", (input, formatted, amount) => {
    expect(formatAmountInput(input)).toBe(formatted);
    expect(parseAmount(formatted)).toBe(amount);
  });

  it(`최대 ${MAX_AMOUNT_DIGITS}자리까지만 받는다 (정밀도 손실 방지)`, () => {
    expect(parseAmount("9".repeat(20))).toBe(Number("9".repeat(MAX_AMOUNT_DIGITS)));
    expect(Number.isSafeInteger(parseAmount("9".repeat(20)))).toBe(true);
  });

  it.each([
    [1, true],
    [300000000, true],
    [0, false],
    [-1, false],
    [1.5, false],
    [Number.MAX_SAFE_INTEGER + 1, false],
    [NaN, false],
  ])("isValidAmount(%d) → %s (0원은 제출 불가)", (amount, expected) => {
    expect(isValidAmount(amount)).toBe(expected);
  });
});

describe("금액 입력 처리 - 속성 기반 (fast-check)", () => {
  const amount = fc.integer({ min: 0, max: 10 ** MAX_AMOUNT_DIGITS - 1 });

  it("어떤 금액이든 표시용으로 바꿨다가 다시 숫자로 바꾸면 원래 값이다", () => {
    fc.assert(
      fc.property(amount, (n) => {
        expect(parseAmount(formatAmountInput(String(n)))).toBe(n);
      }),
    );
  });

  it("어떤 입력이든 표시 결과는 올바른 콤마 형식이고, 숫자는 최대 15자리다", () => {
    fc.assert(
      fc.property(fc.string({ unit: "grapheme-ascii" }), (input) => {
        const formatted = formatAmountInput(input);
        expect(formatted).toMatch(AMOUNT_FORMAT);
        expect(formatted.replaceAll(",", "").length).toBeLessThanOrEqual(MAX_AMOUNT_DIGITS);
      }),
    );
  });

  it("한 번 더 정리해도 결과가 바뀌지 않는다 (입력 중 반복 호출에 안전)", () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const once = formatAmountInput(input);
        expect(formatAmountInput(once)).toBe(once);
      }),
    );
  });

  it("parseAmount는 항상 0 이상의 안전한 정수를 돌려주고, 표시 문자열과 값이 일치한다", () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const value = parseAmount(input);
        expect(Number.isSafeInteger(value) && value >= 0).toBe(true);
        expect(parseAmount(formatAmountInput(input))).toBe(value);
      }),
    );
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  checkIsToday,
  formatStringToDate,
  getCompareWithToday,
  getDateString,
  getDay,
  getKoreaDate,
  getTodayAddDays,
  stringToDate,
} from "./dateUtil";

describe("오늘 날짜 기준 함수", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 한국 시간 2026-11-03 10:00
    vi.setSystemTime(new Date("2026-11-03T01:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("getKoreaDate는 한국 날짜를 YYYYMMDD로 돌려준다", () => {
    expect(getKoreaDate()).toBe("20261103");
  });

  it("UTC로는 전날이어도 한국 날짜 기준으로 계산한다", () => {
    // UTC 2026-11-02 23:30 = 한국 2026-11-03 08:30
    vi.setSystemTime(new Date("2026-11-02T23:30:00Z"));
    expect(getKoreaDate()).toBe("20261103");
  });

  it("checkIsToday는 YYYY-MM-DD와 YYYYMMDD를 모두 받는다", () => {
    expect(checkIsToday("2026-11-03")).toBe(true);
    expect(checkIsToday("20261103")).toBe(true);
    expect(checkIsToday("2026-11-02")).toBe(false);
  });

  it.each([
    ["2026-11-02", "past"],
    ["2026-11-03", "same"],
    ["20261104", "future"],
  ] as const)("getCompareWithToday(%s) → %s", (date, expected) => {
    expect(getCompareWithToday(date)).toBe(expected);
  });

  it("getCompareWithToday는 날짜가 없으면 빈 문자열", () => {
    expect(getCompareWithToday(undefined)).toBe("");
  });

  it("getTodayAddDays는 오늘에서 며칠 뒤 날짜를 돌려준다", () => {
    expect(getDateString(getTodayAddDays(3))).toBe("20261106");
    expect(getDateString(getTodayAddDays())).toBe("20261103");
  });
});

describe("날짜 변환 함수", () => {
  it("stringToDate는 YYYYMMDD를 Date로 바꾼다", () => {
    expect(getDateString(stringToDate("20231223"))).toBe("20231223");
  });

  it("formatStringToDate는 구분자를 넣는다", () => {
    expect(formatStringToDate("20231223", "-")).toBe("2023-12-23");
    expect(formatStringToDate("20231223", ".")).toBe("2023.12.23");
  });

  it("getDateString은 월·일을 두 자리로 맞춘다", () => {
    expect(getDateString(new Date(2026, 0, 5))).toBe("20260105");
  });

  it("getDateString은 날짜가 없거나 잘못되면 빈 문자열", () => {
    expect(getDateString(null)).toBe("");
    expect(getDateString(new Date("invalid"))).toBe("");
  });

  it.each([
    ["20261103", "화"],
    ["2026-11-08", "일"],
    [new Date(2026, 10, 7), "토"],
  ])("getDay(%s) → %s", (date, expected) => {
    expect(getDay(date)).toBe(expected);
  });
});

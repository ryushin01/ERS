import fc from "fast-check";
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
    // 로컬 시간 2026-11-03 정오 (실행하는 PC의 시간대와 상관없이 같은 로컬 날짜)
    vi.setSystemTime(new Date(2026, 10, 3, 12));
    expect(getDateString(getTodayAddDays(3))).toBe("20261106");
    expect(getDateString(getTodayAddDays())).toBe("20261103");
  });
});

describe("날짜 변환 함수", () => {
  it("stringToDate는 YYYYMMDD를 그 날짜의 로컬 자정으로 바꾼다", () => {
    const date = stringToDate("20231223");
    expect([date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours()]).toEqual([
      2023, 12, 23, 0,
    ]);
    expect(getDateString(date)).toBe("20231223");
  });

  it.each(["", "2023-12-23", "2023122", "abcdefgh"])(
    "stringToDate는 형식이 맞지 않으면(%s) Invalid Date",
    (input) => {
      expect(getDateString(stringToDate(input))).toBe("");
    },
  );

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

// 재발 방지: 이전에는 "YYYY-MM-DD"를 UTC 자정으로 해석해서, UTC보다 늦은 시간대에서 하루 전 날짜·요일이 나왔습니다.
// Node는 실행 중에 process.env.TZ를 바꾸면 그 시간대를 바로 적용합니다.
describe.each([
  "Asia/Seoul", // UTC+9
  "UTC",
  "America/New_York", // UTC-5
  "Pacific/Honolulu", // UTC-10
  "Pacific/Kiritimati", // UTC+14
])("시간대 %s", (timeZone) => {
  const originalTimeZone = process.env.TZ;

  beforeEach(() => {
    process.env.TZ = timeZone;
  });

  afterEach(() => {
    // undefined를 대입하면 문자열 "undefined"가 들어가므로, 원래 없던 값은 지웁니다.
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  });

  it("stringToDate 결과를 다시 문자열로 바꾸면 같은 날짜", () => {
    expect(getDateString(stringToDate("20231223"))).toBe("20231223");
    expect(getDateString(stringToDate("20240101"))).toBe("20240101");
  });

  it("getDay는 같은 요일을 돌려준다", () => {
    expect(getDay("20261103")).toBe("화");
    expect(getDay("2026-11-08")).toBe("일");
  });
});

// 속성 기반 테스트: 1900~2100년의 임의 날짜 × 여러 시간대에서 변환 규칙이 항상 지켜지는지 확인
describe("날짜 변환 - 속성 기반 (fast-check)", () => {
  const TIME_ZONES = [
    "Asia/Seoul",
    "UTC",
    "America/New_York",
    "Pacific/Honolulu",
    "Pacific/Kiritimati",
  ];
  const originalTimeZone = process.env.TZ;

  afterEach(() => {
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  });

  const ymd = fc
    .date({
      min: new Date("1900-01-01T00:00:00Z"),
      max: new Date("2100-12-31T00:00:00Z"),
      noInvalidDate: true,
    })
    .map((d) => d.toISOString().slice(0, 10).replaceAll("-", ""));

  it("YYYYMMDD → Date → YYYYMMDD는 어느 시간대에서든 같은 날짜다", () => {
    fc.assert(
      fc.property(ymd, fc.constantFrom(...TIME_ZONES), (date, timeZone) => {
        process.env.TZ = timeZone;
        expect(getDateString(stringToDate(date))).toBe(date);
      }),
    );
  });

  it("구분자를 넣었다 빼도 같은 날짜이고, 요일은 실제 날짜의 요일과 같다", () => {
    const dayList = ["일", "월", "화", "수", "목", "금", "토"];
    fc.assert(
      fc.property(ymd, fc.constantFrom(...TIME_ZONES), (date, timeZone) => {
        process.env.TZ = timeZone;
        const dashed = formatStringToDate(date, "-");
        expect(dashed.replaceAll("-", "")).toBe(date);
        expect(getDay(dashed)).toBe(getDay(date));
        expect(getDay(date)).toBe(dayList[new Date(`${dashed}T12:00:00Z`).getUTCDay()]);
      }),
    );
  });
});

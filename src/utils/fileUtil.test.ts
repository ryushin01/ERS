import { describe, expect, it } from "vitest";

import { checkFileSize, FILE_MAXIMUM_SIZE, formatBytes, formatMegaBytes } from "./fileUtil";

const fileOfSize = (size: number) => ({ size }) as File;

describe("checkFileSize", () => {
  it("최대 용량(20MB)까지는 허용한다", () => {
    expect(checkFileSize(fileOfSize(FILE_MAXIMUM_SIZE))).toBe(true);
    expect(checkFileSize(fileOfSize(0))).toBe(true);
  });

  it("최대 용량을 넘으면 거부한다", () => {
    expect(checkFileSize(fileOfSize(FILE_MAXIMUM_SIZE + 1))).toBe(false);
  });
});

describe("formatBytes", () => {
  it.each([
    [0, "0 Bytes"],
    [500, "500 Bytes"],
    [1024, "1 KB"],
    [1536, "1.5 KB"],
    [1024 ** 2 * 20, "20 MB"],
  ])("%d → %s", (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected);
  });

  it("소수 자릿수를 지정할 수 있다", () => {
    expect(formatBytes(1234567, 1)).toBe("1.2 MB");
  });
});

describe("formatMegaBytes", () => {
  it("MB 단위로 표시한다", () => {
    expect(formatMegaBytes(0)).toBe("0 Bytes");
    expect(formatMegaBytes(1024 ** 2 * 1.5)).toBe("1.5 MB");
  });
});

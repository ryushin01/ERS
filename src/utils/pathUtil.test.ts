import { describe, expect, it } from "vitest";

import { isPathUnder } from "./pathUtil";

describe("isPathUnder", () => {
  it.each([
    ["/financial", "/financial"],
    ["/financial/home", "/financial"],
    ["/financial/home/notice", "/financial/home"],
  ])("%s는 %s 경로에 속한다", (pathname, basePath) => {
    expect(isPathUnder(pathname, basePath)).toBe(true);
  });

  // 이전에는 includes로 판정해서 아래 경로들도 일치했습니다.
  it.each([
    ["/financialx", "/financial"],
    ["/foo/financial", "/financial"],
    ["/admin", "/financial"],
  ])("%s는 %s 경로에 속하지 않는다", (pathname, basePath) => {
    expect(isPathUnder(pathname, basePath)).toBe(false);
  });

  it.each([null, undefined, ""])("pathname이 %s이면 false", (pathname) => {
    expect(isPathUnder(pathname, "/financial")).toBe(false);
  });
});

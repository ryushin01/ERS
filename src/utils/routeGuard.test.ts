import { describe, expect, it } from "vitest";

import { AD_ASSIGN, FI_HOME, LOGIN_PATH } from "@constants/path";

import { resolveRouteRedirect } from "./routeGuard";

describe("resolveRouteRedirect", () => {
  it.each([
    ["/financial/home", undefined, LOGIN_PATH],
    ["/admin/assign", undefined, LOGIN_PATH],
    ["/", undefined, null],
    ["/", "00", FI_HOME],
    ["/admin/assign", "00", FI_HOME],
    ["/financial/home", "00", null],
    ["/", "20", AD_ASSIGN],
    ["/financial/home", "20", AD_ASSIGN],
    ["/admin/assign", "20", null],
    ["/storybook/index.html", "00", null],
  ])("%s, 유형 %s → %s", (pathname, membGbCd, expected) => {
    expect(resolveRouteRedirect(pathname, membGbCd)).toBe(expected);
  });
});

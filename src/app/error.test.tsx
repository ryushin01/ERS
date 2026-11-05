import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AD_ASSIGN, FI_HOME } from "@constants/path";
import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import RouteError from "./error";

const state = vi.hoisted(() => ({ pathname: "/financial/home", push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: state.push }),
  usePathname: () => state.pathname,
}));

const failure = new Error("화면 오류");

beforeEach(() => {
  mockDesktopMatchMedia();
  state.pathname = "/financial/home";
  state.push.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("앱 전체 오류 화면", () => {
  it("오류를 기록하고, 새로고침을 누르면 다시 시도한다", async () => {
    const reset = vi.fn();
    renderWithProviders(<RouteError error={failure} reset={reset} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("일시적인 오류");
    expect(console.error).toHaveBeenCalledWith(failure);

    await userEvent.click(screen.getByRole("button", { name: "새로고침" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["/financial/home", FI_HOME],
    ["/admin/registration", AD_ASSIGN],
  ])("%s에서는 사용자 유형에 맞는 홈으로 보낸다", async (pathname, home) => {
    state.pathname = pathname;
    renderWithProviders(<RouteError error={failure} reset={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "홈으로 이동하기" }));

    expect(state.push).toHaveBeenCalledWith(home);
  });
});

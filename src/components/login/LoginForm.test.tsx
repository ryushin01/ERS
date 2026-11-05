import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cookies from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import LoginForm from "./LoginForm";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/",
}));

describe("LoginForm (데모 모드)", () => {
  beforeEach(() => {
    mockDesktopMatchMedia();
    push.mockClear();
    sessionStorage.clear();
    // Node 버전에 따라 테스트 환경의 localStorage가 없을 수 있어 직접 채움
    const saved = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => saved.set(key, value),
      removeItem: (key: string) => saved.delete(key),
    });
    Cookies.remove("membGbCd");
  });

  it("금융기관(기본 선택)으로 로그인하면 정보를 저장하고 금융기관 홈으로 이동한다", async () => {
    renderWithProviders(<LoginForm isDesktop />);

    await userEvent.click(screen.getByRole("button", { name: "로그인" }));

    expect(Cookies.get("membGbCd")).toBe("00");
    expect(JSON.parse(sessionStorage.getItem("auth")!)).toMatchObject({ membGbCd: "00" });
    expect(push).toHaveBeenCalledExactlyOnceWith("/financial/home");
  });

  it("관리자를 고르면 관리자 첫 화면으로 이동한다", async () => {
    renderWithProviders(<LoginForm isDesktop />);

    await userEvent.click(screen.getByRole("radio", { name: /관리자/ }));
    await userEvent.click(screen.getByRole("button", { name: "로그인" }));

    expect(Cookies.get("membGbCd")).toBe("20");
    expect(push).toHaveBeenCalledExactlyOnceWith("/admin/assign");
  });

  it("법무대리인은 로그인하지 않는다", async () => {
    renderWithProviders(<LoginForm isDesktop />);

    await userEvent.click(screen.getByRole("radio", { name: /법무대리인/ }));
    await userEvent.click(screen.getByRole("button", { name: "로그인" }));

    expect(Cookies.get("membGbCd")).toBeUndefined();
    expect(push).not.toHaveBeenCalled();
  });

  it("저장된 아이디가 있으면 채우고 아이디 저장을 체크한다", () => {
    localStorage.setItem("userId", "saved-id");

    renderWithProviders(<LoginForm isDesktop />);

    expect(screen.getByRole("checkbox", { name: /아이디 저장/ })).toBeChecked();
  });
});

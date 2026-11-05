import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider as JotaiProvider } from "jotai";
import Cookies from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LOGIN_PATH } from "@constants/path";
import { postLogout } from "@services/login";
import { toastState } from "@stores";
import { renderWithProviders } from "@/test/renderWithProviders";

import useLogout from "./useLogout";

/* 데모 모드와 실제 API 모드를 모두 확인합니다. */

const state = vi.hoisted(() => ({ demo: true, push: vi.fn() }));

vi.mock("@constants/env", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  get isDemoMode() {
    return state.demo;
  },
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: state.push }) }));
vi.mock("@services/login", () => ({ postLogout: vi.fn() }));

function LogoutButton({ onLoggedOut }: { onLoggedOut?: () => void }) {
  const logout = useLogout({ onLoggedOut });
  return <button onClick={logout}>로그아웃</button>;
}

const renderButton = (onLoggedOut?: () => void) => {
  const store = createStore();
  renderWithProviders(
    <JotaiProvider store={store}>
      <LogoutButton onLoggedOut={onLoggedOut} />
    </JotaiProvider>,
  );
  return store;
};
const clickLogout = () => userEvent.click(screen.getByRole("button", { name: "로그아웃" }));
const expectLoggedIn = () => {
  expect(sessionStorage.getItem("auth")).not.toBeNull();
  expect(Cookies.get("membGbCd")).toBe("00");
  expect(state.push).not.toHaveBeenCalled();
};

beforeEach(() => {
  state.demo = true;
  state.push.mockReset();
  vi.mocked(postLogout).mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
  sessionStorage.setItem("auth", "{}");
  Cookies.set("membGbCd", "00");
});

describe("useLogout", () => {
  it("데모 모드에서는 API 없이 로그인 정보를 지우고 바로 이동한다", async () => {
    const onLoggedOut = vi.fn();
    renderButton(onLoggedOut);

    await clickLogout();

    expect(postLogout).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("auth")).toBeNull();
    expect(Cookies.get("membGbCd")).toBeUndefined();
    expect(onLoggedOut).toHaveBeenCalledTimes(1);
    expect(state.push).toHaveBeenCalledWith(LOGIN_PATH);
  });

  it("API가 성공하면 로그인 정보를 지우고 로그인 화면으로 이동한다", async () => {
    state.demo = false;
    vi.mocked(postLogout).mockResolvedValue({ data: { code: "00" } } as never);
    renderButton();

    await clickLogout();

    await waitFor(() => expect(sessionStorage.getItem("auth")).toBeNull());
    await waitFor(() => expect(state.push).toHaveBeenCalledWith(LOGIN_PATH), { timeout: 2000 });
  });

  it("API가 실패 코드를 주면 로그인 상태를 유지하고 안내한다", async () => {
    state.demo = false;
    vi.mocked(postLogout).mockResolvedValue({ data: { code: "99" } } as never);
    const store = renderButton();

    await clickLogout();

    await waitFor(() => expect(store.get(toastState).message).toContain("로그아웃에 실패"));
    expectLoggedIn();
  });

  it("네트워크 오류가 나도 로그인 상태를 유지하고 안내한다", async () => {
    state.demo = false;
    vi.mocked(postLogout).mockRejectedValue(new Error("network"));
    const store = renderButton();

    await clickLogout();

    await waitFor(() => expect(store.get(toastState).message).toContain("로그아웃에 실패"));
    expectLoggedIn();
  });
});

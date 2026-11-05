import { useState } from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider as JotaiProvider } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MEMB_GB_CD } from "@constants/auth";
import { CHANGE_PASSWORD_INPUT } from "@constants/input";
import { patchChangePassword } from "@services/changePassword";
import { toastState } from "@stores";
import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import DrawerContent from "./DrawerContent";

/* 계정 메뉴의 권한별 버튼과 비밀번호 변경 양식 */

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/financial/home",
}));
vi.mock("@services/changePassword", () => ({ patchChangePassword: vi.fn() }));

function Harness({ level = MEMB_GB_CD.FINANCIAL }: { level?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <DrawerContent
      level={level}
      isModalOpen={isModalOpen}
      openModal={() => setIsModalOpen(true)}
      closeModal={() => setIsModalOpen(false)}
      profileData="데모 금융기관"
    />
  );
}

const renderContent = (level?: string) => {
  const store = createStore();
  renderWithProviders(
    <JotaiProvider store={store}>
      <Harness level={level} />
    </JotaiProvider>,
  );
  return store;
};

const openForm = async () => {
  await userEvent.click(screen.getByRole("button", { name: "비밀번호 변경" }));
  await screen.findByRole("dialog");
};
const current = () => screen.getByPlaceholderText(CHANGE_PASSWORD_INPUT.currentPassword);
const next = () => screen.getByPlaceholderText(CHANGE_PASSWORD_INPUT.newPassword);
const repeat = () => screen.getByPlaceholderText(CHANGE_PASSWORD_INPUT.repeatPassword);
const fillForm = async () => {
  await userEvent.type(current(), "old-pass1");
  await userEvent.type(next(), "new-pass1");
  await userEvent.type(repeat(), "new-pass1");
};
const submit = () =>
  screen.getByRole("dialog").querySelector<HTMLButtonElement>('[type="submit"]')!;

beforeEach(() => {
  mockDesktopMatchMedia();
  // 모달이 그려지는 자리 (실제 화면은 레이아웃에 있음)
  document.body.innerHTML = '<div id="portal"></div>';
  vi.mocked(patchChangePassword).mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("권한별 표시", () => {
  it("금융기관은 프로필과 비밀번호 변경, 로그아웃을 본다", () => {
    renderContent(MEMB_GB_CD.FINANCIAL);

    expect(screen.getByText("데모 금융기관")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "비밀번호 변경" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /로그아웃/ })).toBeInTheDocument();
  });

  it("관리자는 로그아웃만 본다", () => {
    renderContent(MEMB_GB_CD.ADMIN);

    expect(screen.queryByText("데모 금융기관")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "비밀번호 변경" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /로그아웃/ })).toBeInTheDocument();
  });
});

describe("비밀번호 변경", () => {
  it("세 칸을 모두 채워야 제출할 수 있고, 입력값을 그대로 보낸다", async () => {
    vi.mocked(patchChangePassword).mockResolvedValue({ data: { code: "00" } } as never);
    renderContent();
    await openForm();
    expect(submit()).toBeDisabled();

    await fillForm();
    expect(submit()).toBeEnabled();
    await userEvent.click(submit());

    await waitFor(() => expect(patchChangePassword).toHaveBeenCalledTimes(1));
    expect(vi.mocked(patchChangePassword).mock.calls[0][0]).toMatchObject({
      pwd: "old-pass1",
      newPwd: "new-pass1",
      reNewPwd: "new-pass1",
    });
  });

  it("응답을 기다리는 동안 다시 눌러도 한 번만 보낸다", async () => {
    vi.mocked(patchChangePassword).mockReturnValue(new Promise(() => {}) as never);
    renderContent();
    await openForm();
    await fillForm();

    await userEvent.click(submit());
    await userEvent.click(submit());

    expect(patchChangePassword).toHaveBeenCalledTimes(1);
  });

  it("한글은 입력되지 않고 안내한다", async () => {
    const store = renderContent();
    await openForm();

    await userEvent.type(current(), "a가b");

    expect(current()).toHaveValue("ab");
    expect(store.get(toastState).message).toContain("한글");
  });

  it.each([
    ["01", current],
    ["02", next],
    ["03", repeat],
  ])("실패 코드 %s이면 해당 칸을 오류로 표시한다", async (code, field) => {
    vi.mocked(patchChangePassword).mockResolvedValue({
      data: { code: "99", msg: "실패", data: code },
    } as never);
    renderContent();
    await openForm();
    await fillForm();

    await userEvent.click(submit());

    await waitFor(() => expect(field()).toHaveAttribute("aria-invalid", "true"));
  });

  it("모든 입력칸에 스크린 리더가 읽을 이름이 있다", async () => {
    renderContent();
    await openForm();

    for (const field of [current(), next(), repeat()]) {
      expect(field).toHaveAccessibleName();
    }
  });

  it("취소하고 다시 열면 입력한 비밀번호가 남아 있지 않다", async () => {
    renderContent();
    await openForm();
    await fillForm();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await openForm();

    expect(current()).toHaveValue("");
    expect(next()).toHaveValue("");
    expect(repeat()).toHaveValue("");
    expect(submit()).toBeDisabled();
  });
});

import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MEMB_GB_CD } from "@constants/auth";
import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import AccountLayer from "./AccountLayer";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/financial/home",
}));

/* 실제 헤더처럼 버튼으로 열고, 비밀번호 변경 모달의 열림 상태를 관리합니다. */
function Harness({ onClose }: { onClose: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button autoFocus>계정 메뉴</button>
      <p>바깥 영역</p>
      <AccountLayer
        level={MEMB_GB_CD.FINANCIAL}
        onClose={onClose}
        isModalOpen={isModalOpen}
        openModal={() => setIsModalOpen(true)}
        closeModal={() => setIsModalOpen(false)}
        profileData="데모 금융기관"
      />
    </>
  );
}

beforeEach(() => {
  mockDesktopMatchMedia();
  // 모달이 그려지는 자리 (실제 화면은 레이아웃에 있음)
  document.body.innerHTML = '<div id="portal"></div>';
});

describe("AccountLayer", () => {
  it("바깥을 누르면 닫히고, 안쪽을 누르면 닫히지 않는다", async () => {
    const onClose = vi.fn();
    renderWithProviders(<Harness onClose={onClose} />);

    await userEvent.click(screen.getByText("데모 금융기관"));
    expect(onClose).not.toHaveBeenCalled();

    await userEvent.click(screen.getByText("바깥 영역"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Esc로 닫고 연 버튼으로 초점을 돌려준다", async () => {
    const onClose = vi.fn();
    renderWithProviders(<Harness onClose={onClose} />);
    const opener = screen.getByRole("button", { name: "계정 메뉴" });
    opener.focus();
    screen.getByRole("button", { name: /로그아웃/ }).focus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(opener).toHaveFocus();
  });

  it("비밀번호 변경 모달이 열려 있는 동안에는 바깥 클릭과 Esc로 메뉴가 닫히지 않는다", async () => {
    const onClose = vi.fn();
    renderWithProviders(<Harness onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: "비밀번호 변경" }));
    await screen.findByRole("dialog");
    onClose.mockClear();

    await userEvent.click(screen.getByRole("dialog"));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
  });
});

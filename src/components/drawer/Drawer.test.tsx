import { useState } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import Drawer from "./Drawer";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/financial/home",
}));

function Page() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        열기
      </button>
      {isOpen && (
        <Drawer
          level="00"
          onClose={() => setIsOpen(false)}
          isModalOpen={false}
          openModal={vi.fn()}
          closeModal={vi.fn()}
          profileData="데모 금융기관"
        />
      )}
    </>
  );
}

describe("Drawer 접근성", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div><div id="portal"></div>';
    mockDesktopMatchMedia();
  });

  it("대화상자로 열려 포커스를 받고, 포털 안에 표시된다", async () => {
    renderWithProviders(<Page />);
    await userEvent.click(screen.getByRole("button", { name: "열기" }));

    const dialog = screen.getByRole("dialog", { name: "계정 메뉴" });
    expect(dialog).toHaveFocus();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.getElementById("portal")).toContainElement(dialog);
  });

  it("Esc로 닫으면 연 버튼으로 포커스가 돌아간다", async () => {
    renderWithProviders(<Page />);
    const opener = screen.getByRole("button", { name: "열기" });
    await userEvent.click(opener);

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("닫기 버튼에 이름이 있다", async () => {
    renderWithProviders(<Page />);
    await userEvent.click(screen.getByRole("button", { name: "열기" }));

    await userEvent.click(screen.getByRole("button", { name: "계정 메뉴 닫기" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

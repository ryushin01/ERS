import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockDesktopMatchMedia } from "@/test/renderWithProviders";

import Modal from "./Modal";

/* 실제 화면처럼 페이지 영역과 모달 포털(#portal)을 나란히 둠 */
beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div><div id="portal"></div>';
  // 모달 제목 크기를 화면 크기(useResponsive)로 정하므로 PC 화면 기준 matchMedia를 채움
  mockDesktopMatchMedia();
});

const renderInApp = (ui: React.ReactElement) =>
  render(ui, { container: document.getElementById("app")! });

function Page({ nested = false }: { nested?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInnerOpen, setIsInnerOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        팝업 열기
      </button>
      {isOpen && (
        <Modal title="등기자료" onClose={() => setIsOpen(false)}>
          <input aria-label="접수번호" />
          {nested && (
            <button type="button" onClick={() => setIsInnerOpen(true)}>
              확인 팝업 열기
            </button>
          )}
          {isInnerOpen && (
            <Modal title="확인" onClose={() => setIsInnerOpen(false)}>
              <button type="button">확인</button>
            </Modal>
          )}
        </Modal>
      )}
    </>
  );
}

describe("Modal 접근성", () => {
  it("제목과 연결된 dialog로 표시되고, 열면 모달로 포커스가 이동한다", async () => {
    renderInApp(<Page />);
    await userEvent.click(screen.getByRole("button", { name: "팝업 열기" }));

    const dialog = screen.getByRole("dialog", { name: "등기자료" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();
  });

  it("열려 있는 동안 뒤 페이지는 inert가 되고, 닫으면 해제된다", async () => {
    renderInApp(<Page />);
    await userEvent.click(screen.getByRole("button", { name: "팝업 열기" }));
    expect(document.getElementById("app")).toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("hidden");

    await userEvent.keyboard("{Escape}");
    expect(document.getElementById("app")).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("");
  });

  it("Tab·Shift+Tab은 모달 안에서만 순환한다", async () => {
    renderInApp(<Page />);
    await userEvent.click(screen.getByRole("button", { name: "팝업 열기" }));

    const closeButton = screen.getByRole("button", { name: "모달 팝업 닫기" });
    const input = screen.getByRole("textbox", { name: "접수번호" });

    await userEvent.tab();
    expect(closeButton).toHaveFocus();
    await userEvent.tab();
    expect(input).toHaveFocus();
    await userEvent.tab(); // 마지막 → 처음
    expect(closeButton).toHaveFocus();
    await userEvent.tab({ shift: true }); // 처음 → 마지막
    expect(input).toHaveFocus();
  });

  it("닫으면 모달을 연 버튼으로 포커스가 돌아간다", async () => {
    renderInApp(<Page />);
    const opener = screen.getByRole("button", { name: "팝업 열기" });
    await userEvent.click(opener);

    await userEvent.click(screen.getByRole("button", { name: "모달 팝업 닫기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  // 재발 방지: 이전에는 모달마다 Esc를 받아서 겹친 모달이 한꺼번에 닫히고, 위 모달을 닫으면 스크롤 잠금이 풀렸습니다.
  it("모달이 겹쳐 있으면 Esc는 맨 위 모달만 닫고, 아래 모달의 배경 잠금은 유지된다", async () => {
    renderInApp(<Page nested />);
    await userEvent.click(screen.getByRole("button", { name: "팝업 열기" }));
    await userEvent.click(screen.getByRole("button", { name: "확인 팝업 열기" }));
    expect(screen.getAllByRole("dialog")).toHaveLength(2);

    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("dialog", { name: "등기자료" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "확인" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.getElementById("app")).toHaveAttribute("inert");
  });

  it("백드롭을 누르면 닫힌다", async () => {
    const onClose = vi.fn();
    renderInApp(
      <Modal title="안내" onClose={onClose}>
        내용
      </Modal>,
    );

    await userEvent.click(document.querySelector("._modal-backdrop")!);
    expect(onClose).toHaveBeenCalledOnce();
  });
});

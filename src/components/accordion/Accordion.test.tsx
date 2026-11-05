import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getFileDownLoad } from "@services/file";
import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import Accordion from "./Accordion";

vi.mock("@services/file", () => ({ getFileDownLoad: vi.fn() }));

const renderAccordion = (fileInfoList: { seq: string; filIdx: number; attcFilNm: string }[] = []) =>
  renderWithProviders(
    <Accordion
      id={1}
      title="공지 제목"
      author="관리자"
      date="2026.11.05"
      description="공지 내용"
      fileInfoList={fileInfoList as never}
    />,
  );

beforeEach(() => {
  mockDesktopMatchMedia();
  vi.mocked(getFileDownLoad).mockReset();
});

describe("Accordion 접근성", () => {
  it("열림·닫힘 상태를 aria-expanded로 알린다", async () => {
    renderAccordion();

    const trigger = screen.getByRole("button", { name: /공지 제목/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Accordion 첨부파일", () => {
  it("첨부파일이 없으면 다운로드 버튼을 그리지 않는다", () => {
    renderAccordion();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("첨부파일을 누르면 원래 파일 이름으로 내려받는다", async () => {
    vi.mocked(getFileDownLoad).mockResolvedValue({
      data: "pdf",
      headers: { "content-type": "application/pdf" },
    } as never);
    URL.createObjectURL = vi.fn(() => "blob:test");
    URL.revokeObjectURL = vi.fn();
    const names: string[] = [];
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      names.push(this.download);
    });
    renderAccordion([{ seq: "S1", filIdx: 2, attcFilNm: "점검 안내.pdf" }]);

    await userEvent.click(screen.getByRole("button", { name: "점검 안내.pdf" }));

    await waitFor(() => expect(names).toEqual(["점검 안내.pdf"]));
    expect(getFileDownLoad).toHaveBeenCalledWith({ seq: "S1", filidx: "2" });
    click.mockRestore();
  });
});

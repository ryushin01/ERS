import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import Accordion from "./Accordion";

describe("Accordion 접근성", () => {
  beforeEach(() => {
    mockDesktopMatchMedia();
  });

  it("열림·닫힘 상태를 aria-expanded로 알린다", async () => {
    renderWithProviders(
      <Accordion
        id={1}
        title="공지 제목"
        author="관리자"
        date="2026.11.05"
        description="공지 내용"
        fileInfoList={[]}
      />,
    );

    const trigger = screen.getByRole("button", { name: /공지 제목/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

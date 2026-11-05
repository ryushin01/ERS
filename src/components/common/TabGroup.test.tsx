import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TabGroup from "./TabGroup";

const ITEMS = [
  { label: "미배정", content: <p>미배정 목록</p>, count: 3 },
  { label: "배정완료", content: <p>배정완료 목록</p> },
  { label: "진행취소", content: <p>진행취소 목록</p> },
];

describe("TabGroup (WAI-ARIA 탭 패턴)", () => {
  it("선택된 탭과 패널을 연결하고, 선택된 탭만 Tab 이동 대상이다", () => {
    render(<TabGroup items={ITEMS} isDesktop />);

    const [first, second] = screen.getAllByRole("tab");
    expect(first).toHaveAttribute("aria-selected", "true");
    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("aria-selected", "false");
    expect(second).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tabpanel", { name: /미배정/ })).toHaveTextContent("미배정 목록");
  });

  it("누르면 내용이 바뀌고 onTabChange를 호출한다", async () => {
    const onTabChange = vi.fn();
    render(<TabGroup items={ITEMS} onTabChange={onTabChange} isDesktop />);

    await userEvent.click(screen.getByRole("tab", { name: "배정완료" }));

    expect(onTabChange).toHaveBeenCalledExactlyOnceWith(1);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("배정완료 목록");
  });

  it.each([
    ["{ArrowRight}", 0, 1],
    ["{ArrowLeft}", 0, 2],
    ["{ArrowRight}", 2, 0],
    ["{End}", 0, 2],
    ["{Home}", 2, 0],
  ])("%s 키: %i번 탭에서 %i번 탭으로 이동하고 초점도 옮긴다", async (key, from, to) => {
    render(<TabGroup items={ITEMS} defaultTab={from} isDesktop />);
    screen.getAllByRole("tab")[from].focus();

    await userEvent.keyboard(key);

    const target = screen.getAllByRole("tab")[to];
    expect(target).toHaveFocus();
    expect(target).toHaveAttribute("aria-selected", "true");
  });

  it("다른 키는 탭을 바꾸지 않는다", async () => {
    const onTabChange = vi.fn();
    render(<TabGroup items={ITEMS} onTabChange={onTabChange} isDesktop />);
    screen.getAllByRole("tab")[0].focus();

    await userEvent.keyboard("a");

    expect(onTabChange).not.toHaveBeenCalled();
  });
});

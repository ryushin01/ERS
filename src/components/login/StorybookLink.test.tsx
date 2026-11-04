import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { STORYBOOK_URL } from "@constants/path";

import StorybookLink, { STORYBOOK_TRANSITION_KEY, STORYBOOK_TRANSITION_MS } from "./StorybookLink";

/** prefers-reduced-motion 설정을 바꿔 가며 확인합니다. */
function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe("StorybookLink", () => {
  const assign = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    vi.stubGlobal("location", { ...window.location, assign });
  });

  afterEach(() => {
    vi.useRealTimers();
    assign.mockReset();
  });

  it("Storybook 주소로 가는 링크를 표시한다", () => {
    mockReducedMotion(false);
    render(<StorybookLink isDesktop />);
    expect(screen.getByRole("link", { name: /Storybook 바로 가기/ })).toHaveAttribute(
      "href",
      STORYBOOK_URL,
    );
  });

  it("누르면 전환 화면을 띄우고, 애니메이션이 끝난 뒤 Storybook으로 이동한다", () => {
    mockReducedMotion(false);
    render(<StorybookLink isDesktop />);

    const notPrevented = fireEvent.click(screen.getByRole("link"));
    expect(notPrevented).toBe(false); // 기본 이동을 막고 애니메이션 진행
    expect(screen.getByRole("status")).toHaveTextContent("컴포넌트 문서로 이동하고 있어요");
    expect(sessionStorage.getItem(STORYBOOK_TRANSITION_KEY)).not.toBeNull();

    act(() => vi.advanceTimersByTime(STORYBOOK_TRANSITION_MS - 1));
    expect(assign).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(assign).toHaveBeenCalledExactlyOnceWith(STORYBOOK_URL);
  });

  it("전환 중에 다시 눌러도 한 번만 이동한다", () => {
    mockReducedMotion(false);
    render(<StorybookLink isDesktop />);

    const link = screen.getByRole("link");
    fireEvent.click(link);
    fireEvent.click(link);
    act(() => vi.advanceTimersByTime(STORYBOOK_TRANSITION_MS));

    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(assign).toHaveBeenCalledOnce();
  });

  it("동작 줄이기 설정이면 애니메이션 없이 링크 기본 동작으로 이동한다", () => {
    mockReducedMotion(true);
    render(<StorybookLink isDesktop />);

    const notPrevented = fireEvent.click(screen.getByRole("link"));
    expect(notPrevented).toBe(true);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("새 탭으로 열 때(⌘/Ctrl+클릭)는 브라우저 기본 동작을 따른다", () => {
    mockReducedMotion(false);
    render(<StorybookLink isDesktop />);

    expect(fireEvent.click(screen.getByRole("link"), { metaKey: true })).toBe(true);
    expect(fireEvent.click(screen.getByRole("link"), { ctrlKey: true })).toBe(true);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

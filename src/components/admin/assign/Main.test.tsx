import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PROC_STAT_CD } from "@constants/code";
import { REGISTRATIONS } from "@/mocks/data";
import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import Main from "./Main";

/* 통합 테스트: 관리자 배정관리의 미배정 건수, 탭, 의뢰번호 검색 */

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/admin/assign",
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  sessionStorage.clear();
  mockDesktopMatchMedia();
});

const shownNumbers = () =>
  [...new Set(screen.queryAllByText(/^DEMO-\d+$/).map((el) => el.textContent))].sort();

describe("배정관리", () => {
  it("미배정 건수와 목록을 보여 준다", async () => {
    renderWithProviders(<Main />);

    await waitFor(
      () => expect(screen.getByText(/^미배정 \d+건$/)).not.toHaveTextContent("미배정 0건"),
      {
        timeout: 3000,
      },
    );
    expect(shownNumbers().length).toBeGreaterThan(0);
  });

  it("검색은 검색 버튼을 눌러야 적용되고 입력한 번호만 보여 준다", async () => {
    renderWithProviders(<Main />);
    const target = (await screen.findAllByText(/^DEMO-\d+$/, {}, { timeout: 3000 }))[0]
      .textContent!;
    const before = shownNumbers();

    await userEvent.type(screen.getByPlaceholderText(/의뢰번호/), target);
    expect(shownNumbers()).toEqual(before);

    await userEvent.click(screen.getByRole("button", { name: "검색" }));
    await waitFor(() => expect(shownNumbers()).toEqual([target]), { timeout: 3000 });
  });

  it("탭을 바꾸면 해당 상태의 목록으로 바뀐다", async () => {
    renderWithProviders(<Main />);
    await screen.findAllByText(/^DEMO-\d+$/, {}, { timeout: 3000 });
    const before = shownNumbers();

    await userEvent.click(screen.getByRole("tab", { name: "진행취소" }));

    const cancelled = REGISTRATIONS.filter((item) => item.statCd === PROC_STAT_CD.CANCEL)
      .map((item) => item.rqstNo)
      .sort();
    await waitFor(() => expect(shownNumbers()).toEqual(cancelled), { timeout: 3000 });
    expect(shownNumbers()).not.toEqual(before);
  });
});

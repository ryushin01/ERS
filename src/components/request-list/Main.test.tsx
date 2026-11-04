import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PAGE_LIMIT_PC } from "@constants/page";
import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import Main from "./Main";

/*
 * 통합 테스트: 금융기관 의뢰목록 화면을 데모 목업 데이터로 렌더링해,
 * 탭별 전체 건수와 목록(의뢰번호·진행상태)이 API 응답과 같은지 확인합니다.
 */

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/financial/request-list",
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  sessionStorage.clear();
  mockDesktopMatchMedia();
});

/** 목업 데이터에서 직접 고른 탭별 의뢰 (의뢰일 최신순은 목업 순서와 같음) */
async function expectedTab(tabSelection: string) {
  const { REGISTRATIONS, REQUEST_TAB_STATUS } = await import("@/mocks/data");
  return REGISTRATIONS.filter((item) => REQUEST_TAB_STATUS[tabSelection].includes(item.statCd));
}

const listRows = () => {
  const table = screen.getByRole("table", { name: /전자등기 의뢰목록/ });
  return within(table.querySelector("tbody")!).queryAllByRole("row");
};

describe("금융기관 의뢰목록 화면 (데모 데이터 통합)", () => {
  it.each([
    [0, "미배정", "00"],
    [1, "배정완료", "01"],
    [2, "진행보류", "02"],
    [3, "진행취소", "03"],
  ])(
    "%i번째 탭(%s): 전체 건수와 첫 페이지 목록이 데이터와 같다",
    async (index, label, tabSelection) => {
      const expected = await expectedTab(tabSelection);
      renderWithProviders(<Main />);

      if (index > 0) {
        await screen.findByText(/전체/);
        await userEvent.click(screen.getByRole("tab", { name: label }));
      }

      await vi.waitFor(
        () =>
          expect(screen.getByText(/전체/).closest("p, div")).toHaveTextContent(
            `전체 ${expected.length}건`,
          ),
        { timeout: 3000 },
      );
      await vi.waitFor(
        () => expect(listRows()).toHaveLength(Math.min(expected.length, PAGE_LIMIT_PC)),
        {
          timeout: 3000,
        },
      );

      // 각 행의 의뢰번호와 진행상태가 데이터 순서대로 표시됨
      listRows().forEach((row, i) => {
        expect(row).toHaveTextContent(expected[i].rqstNo);
        expect(row).toHaveTextContent(expected[i].statNm);
      });
    },
  );
});

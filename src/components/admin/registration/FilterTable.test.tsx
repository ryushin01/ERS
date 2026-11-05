import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { REGISTRATIONS } from "@/mocks/data";
import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import Main from "./Main";

/*
 * 통합 테스트: 관리자 등기관리의 검색 조건이 목업 API까지 전달되어 목록에 반영되는지 확인합니다.
 * 탭은 "전체"를 기준으로 합니다.
 */

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/admin/registration",
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  sessionStorage.clear();
  mockDesktopMatchMedia();
});

const shownNumbers = () =>
  [...new Set(screen.queryAllByText(/^DEMO-\d+$/).map((el) => el.textContent))].sort();
const expectShown = (numbers: (string | null)[]) =>
  waitFor(() => expect(shownNumbers()).toEqual([...numbers].sort()), { timeout: 3000 });
const shownCount = async () => {
  await screen.findAllByText(/^DEMO-\d+$/, {}, { timeout: 3000 });
  return shownNumbers();
};
const search = () => userEvent.click(screen.getByRole("button", { name: "검색" }));
const numberInput = () => screen.getByPlaceholderText("의뢰번호를 입력해 주세요");
const TARGET = REGISTRATIONS[0].rqstNo;

describe("등기관리 검색", () => {
  it("의뢰번호로 검색하고, 초기화하면 전체 목록으로 돌아온다", async () => {
    renderWithProviders(<Main />);
    const all = await shownCount();

    await userEvent.type(numberInput(), TARGET);
    await search();
    await expectShown([TARGET]);

    await userEvent.click(screen.getByRole("button", { name: "초기화" }));
    await expectShown(all);
    expect(numberInput()).toHaveValue("");
  });

  it("기간 버튼은 입력해 둔 의뢰번호 조건과 함께 바로 적용된다", async () => {
    renderWithProviders(<Main />);
    await shownCount();

    await userEvent.type(numberInput(), TARGET);
    await search();
    await expectShown([TARGET]);

    await userEvent.click(screen.getByRole("button", { name: "오늘" }));
    await expectShown([TARGET]);
  });

  it("헤더 검색으로 오면 번호를 채워 검색하고, 다시 검색해도 유지한다", async () => {
    sessionStorage.setItem("admin-rqstno", TARGET);
    renderWithProviders(<Main />);

    await expectShown([TARGET]);
    expect(numberInput()).toHaveValue(TARGET);

    await search();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expectShown([TARGET]);
  });
});

describe("등기관리 페이지 나누기", () => {
  const original = REGISTRATIONS.length;

  beforeEach(() => {
    // 120건이 되도록 복제 (페이지 크기 50이면 3쪽, 100이면 2쪽)
    for (let i = original; i < 120; i += 1) {
      REGISTRATIONS.push({ ...REGISTRATIONS[0], rqstNo: `DEMO-${String(5000 + i)}` });
    }
  });

  afterEach(() => {
    REGISTRATIONS.length = original;
  });

  const pageButton = (name: string) => screen.queryByRole("button", { name });

  it("한 페이지 개수를 바꾸면 쪽수를 다시 계산하고 첫 페이지로 돌아온다", async () => {
    renderWithProviders(<Main />);
    await waitFor(() => expect(pageButton("3")).toBeInTheDocument(), { timeout: 3000 });

    await userEvent.click(pageButton("3")!);
    await waitFor(() => expect(pageButton("3")).toHaveAttribute("aria-current", "page"));

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "한 페이지에 보여 줄 개수" }),
      "100",
    );

    await waitFor(() => expect(pageButton("1")).toHaveAttribute("aria-current", "page"));
    expect(pageButton("2")).toBeInTheDocument();
    expect(pageButton("3")).not.toBeInTheDocument();
  });

  it("기간 버튼으로 조건을 바꾸면 첫 페이지로 돌아온다", async () => {
    renderWithProviders(<Main />);
    await waitFor(() => expect(pageButton("2")).toBeInTheDocument(), { timeout: 3000 });

    await userEvent.click(pageButton("2")!);
    await waitFor(() => expect(pageButton("2")).toHaveAttribute("aria-current", "page"));

    await userEvent.click(screen.getByRole("button", { name: "1개월" }));

    await waitFor(() => expect(pageButton("1")).toHaveAttribute("aria-current", "page"));
  });
});

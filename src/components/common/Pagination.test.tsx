import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { mockDesktopMatchMedia } from "@/test/renderWithProviders";

import Pagination from "./Pagination";

function Harness({ total = 240, limit = 10, pageCount = 10 }) {
  const [page, setPage] = useState(1);
  return (
    <>
      <output data-testid="page">{page}</output>
      <Pagination total={total} page={page} limit={limit} pageCount={pageCount} setPage={setPage} />
    </>
  );
}

const button = (alt: RegExp) => screen.getByRole("img", { name: alt }).closest("button")!;
const FIRST = /첫 페이지/;
const PREV = /이전/;
const NEXT = /다음/;
const LAST = /마지막/;

describe("Pagination", () => {
  beforeEach(mockDesktopMatchMedia);

  it("결과가 없으면 표시하지 않는다", () => {
    const { container } = render(<Harness total={0} />);
    expect(container.querySelector("button")).toBeNull();
  });

  it("첫 페이지에서는 처음·이전이, 마지막 페이지에서는 다음·마지막이 비활성화된다", async () => {
    render(<Harness />);
    expect(button(FIRST)).toBeDisabled();
    expect(button(PREV)).toBeDisabled();

    await userEvent.click(button(LAST));

    expect(screen.getByTestId("page")).toHaveTextContent("24");
    expect(button(NEXT)).toBeDisabled();
    expect(button(LAST)).toBeDisabled();
  });

  it("번호 묶음의 끝에서 다음을 누르면 다음 묶음으로 넘어간다", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "10" }));
    expect(screen.queryByRole("button", { name: "11" })).not.toBeInTheDocument();

    await userEvent.click(button(NEXT));

    expect(screen.getByTestId("page")).toHaveTextContent("11");
    expect(screen.getByRole("button", { name: "11" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "10" })).not.toBeInTheDocument();
  });

  it("묶음의 처음에서 이전을 누르면 이전 묶음으로 돌아간다", async () => {
    render(<Harness />);
    await userEvent.click(button(LAST));
    await userEvent.click(button(FIRST));
    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Checkbox from "./Checkbox";
import Radio from "./Radio";

/* 표시용 아이콘은 이름에 섞이지 않으므로, 선택 상태가 바뀌어도 항목 이름은 라벨 그대로입니다. */

describe("선택 입력의 접근 가능한 이름", () => {
  it.each([true, false])("라디오는 checked=%s에서도 라벨만 읽는다", (checked) => {
    render(<Radio name="a" value="1" labelText="보기" checked={checked} onChange={vi.fn()} />);
    expect(screen.getByRole("radio", { name: "보기" })).toBeInTheDocument();
  });

  it.each([true, false])("체크박스는 checked=%s에서도 라벨만 읽는다", (checked) => {
    render(<Checkbox name="a" labelText="동의" checked={checked} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox", { name: "동의" })).toBeInTheDocument();
  });
});

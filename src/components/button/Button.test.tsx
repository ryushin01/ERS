import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Button from "./Button";

describe("Button", () => {
  it("텍스트를 표시하고, 누르면 onClick을 호출한다", async () => {
    const onClick = vi.fn();
    render(
      <Button shape="solid" size="md" color="main100" onClick={onClick}>
        저장
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("저장");
    expect(button).toHaveAttribute("type", "button");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('버튼 이름은 화면의 글자와 같다 ("버튼"을 덧붙이지 않음)', () => {
    render(
      <Button shape="solid" size="md" color="main100">
        저장
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("저장");
  });

  it("disabled이면 누를 수 없고 비활성 스타일이 붙는다", async () => {
    const onClick = vi.fn();
    render(
      <Button shape="solid" size="md" color="main100" onClick={onClick} disabled>
        저장
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("_disabled");

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("type을 submit으로 지정할 수 있다", () => {
    render(
      <Button type="submit" shape="outline" size="sm" color="grayscale">
        조회
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("iconPosition에 맞춰 아이콘을 텍스트 앞이나 뒤에 둔다", () => {
    const { rerender } = render(
      <Button
        shape="solid"
        size="md"
        color="main100"
        icon={<i data-testid="icon" />}
        iconPosition="left"
      >
        다음
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.firstElementChild).toContainElement(screen.getByTestId("icon"));

    rerender(
      <Button
        shape="solid"
        size="md"
        color="main100"
        icon={<i data-testid="icon" />}
        iconPosition="right"
      >
        다음
      </Button>,
    );
    expect(button.lastElementChild).toContainElement(screen.getByTestId("icon"));
  });

  it.each([
    ["sm", "py-2", "rounded-md"],
    ["md", "py-3", "rounded-lg"],
    ["lg", "py-4", "rounded-lg"],
  ] as const)("size=%s이면 %s, %s 클래스가 붙는다", (size, padding, radius) => {
    render(
      <Button shape="solid" size={size} color="main100">
        확인
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass(padding, radius);
  });
});

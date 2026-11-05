import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import InputField from "./InputField";

describe("InputField 접근성", () => {
  it("오류 상태와 오류 문구를 입력칸에 연결한다", () => {
    render(
      <InputField
        name="id"
        type="text"
        ariaLabel="아이디"
        isError
        errorMessage="아이디를 입력해 주세요."
      />,
    );

    const input = screen.getByRole("textbox", { name: "아이디" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("아이디를 입력해 주세요.");
  });

  it("오류가 없으면 오류로 표시하지 않고, 안내 문구를 연결한다", () => {
    render(<InputField name="id" type="text" ariaLabel="아이디" inputMessage="영문 8자 이상" />);

    const input = screen.getByRole("textbox", { name: "아이디" });
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).toHaveAccessibleDescription("영문 8자 이상");
  });

  it("문구가 없으면 설명을 연결하지 않는다", () => {
    render(<InputField name="id" type="text" ariaLabel="아이디" isError />);

    expect(screen.getByRole("textbox", { name: "아이디" })).not.toHaveAttribute("aria-describedby");
  });

  it("비밀번호 보기 버튼에 이름이 있다", () => {
    render(<InputField name="pwd" type="password" ariaLabel="비밀번호" />);

    expect(screen.getByRole("button", { name: "비밀번호 보기" })).toBeInTheDocument();
  });
});

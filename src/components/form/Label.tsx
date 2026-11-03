import { ReactNode } from "react";
import { Typography } from "@components/common";
import "@styles/input.css";

type LabelProps = {
  htmlFor?: string;
  labelText?: string;
  children?: ReactNode;
  required?: boolean;
  isError?: boolean;
  isPassword?: boolean;
  styleClass?: string;
  hasIcon?: boolean;
  labelSize?: "sm" | "md";
};

/**
 * @name Label
 * @version 1.1.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @property {string} htmlFor      - 인풋 id와 매치 시키는 라벨 속성을 정의합니다.
 * @property {string} labelText    - 라벨의 텍스트 내용을 정의합니다.
 * @property {ReactNode} children  - 라벨과 함께 배치되는 input을 정의합니다.
 * @property {boolean} required    - 라벨에 필수 표시 여부를 정의합니다.
 * @property {string} labelSize    - 라벨 사이즈 정의
 */
export default function Label({
  htmlFor,
  labelText,
  hasIcon,
  children,
  isError,
  required,
  styleClass,
  labelSize,
}: LabelProps) {
  const labelStyle = `${isError ? "_error" : ""} ${
    hasIcon ? "_with-icon-label" : ""
  }`;

  const style = [
    labelStyle,
    !htmlFor && labelText && "_only-label",
    htmlFor && !labelText && "_only-htmlFor",
    !htmlFor && !labelText && "_only-input",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      {!htmlFor ? (
        <label className={style}>
          {labelText && (
            <Typography kind="title-small" className="min-w-[10%] px-1">
              {labelText}
            </Typography>
          )}
          {labelText && required && (
            <span className="text-koser-secondary-red-50 pl-1">*</span>
          )}
          {children}
        </label>
      ) : (
        <div className={labelText ? styleClass : ""}>
          <label htmlFor={htmlFor} className={labelText ? "" : style}>
            {labelText && (
              <Typography
                kind={labelSize === "md" ? "title-medium" : "title-small"}
                isBold={labelSize === "md" && true}
              >
                {labelText}
              </Typography>
            )}
            {labelText && required && (
              <span className="text-koser-secondary-red-50 pl-1">*</span>
            )}
          </label>
          {children}
        </div>
      )}
    </div>
  );
}

import { Fragment } from "react";

import { Button } from "@components/button";

import "@styles/button-group.css";

type ButtonGroupProps = {
  size: string;
  data: ButtonGroupDataProps[];
  selectedButtonGroup: boolean[];
  handleButtonGroup: (index: number) => void;
};

type ButtonGroupDataProps = {
  id: string;
  content: string;
  disabled: boolean;
};

/**
 * @name ButtonGroup
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description - 부모 컴포넌트가 클라이언트 컴포넌트이어야 합니다.
 *              - 선택 상태는 토글 버튼의 aria-pressed로 나타냅니다. (탭 목록이 아니므로 role="tab"·aria-selected를 쓰지 않음)
 * @property {string} size                    - 버튼 크기
 * @property {string} content                 - 버튼 내부 텍스트 및 웹 접근성 처리
 * @property {boolean} disabled               - 버튼 비활성화 여부
 * @property {boolean[]} selectedButtonGroup  - 선택 유무가 저장된 배열
 * @property {function} handleButtonGroup     - 버튼 그룹 제어 함수
 */

export default function ButtonGroup({
  size,
  data,
  selectedButtonGroup,
  handleButtonGroup,
}: ButtonGroupProps) {
  return (
    <div className={`_button-group ${size}`}>
      {data.map((button, index) => {
        const { id, content, disabled } = button;

        return (
          <Fragment key={id}>
            <Button
              shape="outline"
              size="sm"
              color="grayscale"
              onClick={() => handleButtonGroup(index)}
              isPressed={selectedButtonGroup[index] || false}
              disabled={disabled}
            >
              {content}
            </Button>
          </Fragment>
        );
      })}
    </div>
  );
}

import { useSetAtom } from "jotai";

import { Button } from "@components/button";
import { toastState } from "@stores";

import ToastPopup from "./ToastPopup";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * 전역 토스트(jotai `toastState`)를 화면 위·아래에 3초 동안 보여 줍니다.
 * ToastPopup은 앱 루트(그리고 Storybook 공통 데코레이터)에 한 번만 둡니다.
 */
const meta = {
  title: "Common/ToastPopup",
  component: ToastPopup,
  tags: ["autodocs"],
  parameters: { docs: { story: { inline: false, height: "360px" } } },
} satisfies Meta<typeof ToastPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

function Trigger({ position, message }: { position: "top" | "bottom"; message: string }) {
  const openToast = useSetAtom(toastState);
  return (
    <div className="w-60">
      <Button
        shape="solid"
        size="md"
        color="main100"
        onClick={() => openToast({ message, position })}
      >
        {`토스트 띄우기 (${position})`}
      </Button>
    </div>
  );
}

export const Top: Story = {
  render: () => <Trigger position="top" message="저장되었습니다." />,
};

/** 모바일에서는 화면 아래에 띄웁니다. 줄바꿈(\n)으로 여러 줄을 표시합니다. */
export const BottomMultiline: Story = {
  render: () => (
    <Trigger
      position="bottom"
      message={"아이디 또는 비밀번호가 일치하지 않습니다.\n다시 확인해 주세요."}
    />
  ),
};

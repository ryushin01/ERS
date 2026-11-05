import { fn } from "storybook/test";

import { Button } from "@components/button";
import { Typography } from "@components/common";
import { Toggle } from "@/stories/helpers";

import Modal from "./Modal";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * #portal에 띄우는 대화상자(role="dialog")입니다.
 * 열리면 대화상자로 포커스가 이동하고, ESC·배경 클릭·닫기 버튼으로 닫힙니다.
 */
const meta = {
  title: "Components/Overlays/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { docs: { story: { inline: false, height: "640px" } } },
  args: { title: "보완요청", size: "sm", onClose: fn(), children: null },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    children: { control: false },
  },
  render: (args) => (
    <Toggle label="모달 열기">
      {(close) => (
        <Modal
          {...args}
          onClose={() => {
            close();
            args.onClose();
          }}
        >
          <div className="flex flex-col gap-y-6">
            <Typography kind="body-large">{`${args.title} 내용을 표시하는 영역입니다.`}</Typography>
            <Button shape="solid" size="md" color="main100" onClick={close}>
              확인
            </Button>
          </div>
        </Modal>
      )}
    </Toggle>
  ),
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {};

export const Medium: Story = { args: { size: "md", title: "비밀번호 변경" } };

export const ExtraLarge: Story = { args: { size: "xl", title: "등기자료" } };

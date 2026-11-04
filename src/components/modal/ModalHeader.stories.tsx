import { fn } from "storybook/test";

import ModalHeader from "./ModalHeader";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/modal.css";

/** 모달 제목과 닫기 버튼 */
const meta = {
  title: "Modal/ModalHeader",
  component: ModalHeader,
  tags: ["autodocs"],
  args: { title: "등기접수증", titleId: "modal-title", onClose: fn() },
  decorators: [
    (Story) => (
      <div className="_modal-container _md relative">
        <div className="_modal-container-wrapper">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ModalHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import { fn } from "storybook/test";

import TextArea from "./TextArea";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 글자 수를 함께 표시하는 여러 줄 입력칸 (처리 사유 등) */
const meta = {
  title: "Components/Inputs/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  args: {
    name: "procRsnCnts",
    isError: false,
    placeholder: "사유를 입력해 주세요",
    maxLength: 200,
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "등기자료 이미지가 흐릿합니다. 계약서 전체 페이지를 다시 촬영해 주세요." },
};

export const Error: Story = { args: { isError: true } };

export const Disabled: Story = { args: { disabled: true } };

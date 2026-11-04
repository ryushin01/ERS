import InputMessage from "./InputMessage";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Form/InputMessage",
  component: InputMessage,
  tags: ["autodocs"],
  args: { children: "영문·숫자 조합 8자 이상 입력해 주세요." },
} satisfies Meta<typeof InputMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

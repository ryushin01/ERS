import ErrorMessage from "./ErrorMessage";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Form/ErrorMessage",
  component: ErrorMessage,
  tags: ["autodocs"],
  args: { children: "필수 입력 항목입니다." },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

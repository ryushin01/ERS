import TemporaryLoading from "./TemporaryLoading";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 미구현 메뉴(회원관리·공지관리)에 보여 주는 "서비스 준비 중" 안내 */
const meta = {
  title: "Components/Feedback/TemporaryLoading",
  component: TemporaryLoading,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <section className="_flex-center flex-col gap-y-5 py-10">
        <Story />
      </section>
    ),
  ],
} satisfies Meta<typeof TemporaryLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

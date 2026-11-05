import Footer from "./Footer";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Layout/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  // 푸터 글자색은 레이아웃 안에서 적용되므로, 같은 구조에서 접근성 검사를 받도록 감쌉니다.
  decorators: [
    (Story) => (
      <div className="_main-outer-wrapper">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

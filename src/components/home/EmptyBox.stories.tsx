import EmptyBox from "./EmptyBox";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 홈 표에 데이터가 없을 때의 안내 */
const meta = {
  title: "Pages/Financial/Home/EmptyBox",
  component: EmptyBox,
  tags: ["autodocs"],
  args: { element: "등록된 공지사항이 없습니다." },
  decorators: [
    (Story) => (
      <div className="h-40 rounded-xl border border-ers-grayscale-30">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

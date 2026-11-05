import EmptyBox from "./EmptyBox";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/responsive-swiper.css";

/** 업로드한 등기자료 이미지가 없을 때의 자리 표시 */
const meta = {
  title: "Pages/Admin/AssignCreate/EmptyBox",
  component: EmptyBox,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[400px] h-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

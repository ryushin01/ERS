import { routeParameters } from "@/stories/helpers";

import Banner from "./Banner";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/home.css";

/** 인사말과 오늘 실행·진행중·접수완료 건수, 전자등기 의뢰 바로가기 */
const meta = {
  title: "Pages/Financial/Home/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: routeParameters("/financial/home"),
  args: { name: "데모 금융기관", totalcount: 3, inprogress: 9, application: 6 },
  decorators: [
    (Story) => (
      <div className="_main">
        <div className="_banner-section">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Zero: Story = { args: { totalcount: 0, inprogress: 0, application: 0 } };

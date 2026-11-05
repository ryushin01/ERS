import { mobileViewport, routeParameters, withCommonLayout } from "@/stories/helpers";

import Main from "./Main";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 금융기관 홈 화면: 통계 배너 + 실시간 등기현황 + 공지사항 (데모 목업 API로 조회) */
const meta = {
  title: "Pages/Financial/Home/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "financial",
    docs: { story: { inline: false, height: "900px" } },
    ...routeParameters("/financial/home"),
  },
  decorators: [withCommonLayout],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

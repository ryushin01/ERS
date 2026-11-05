import { mobileViewport, routeParameters, withCommonLayout } from "@/stories/helpers";

import Main from "./Main";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 금융기관 현황조회: 검색 조건 + 결과 표 */
const meta = {
  title: "Pages/Financial/StatusInquiry/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "financial",
    docs: { story: { inline: false, height: "1000px" } },
    ...routeParameters("/financial/status-inquiry"),
  },
  decorators: [withCommonLayout],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

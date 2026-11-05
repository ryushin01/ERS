import { mobileViewport, routeParameters, withCommonLayout } from "@/stories/helpers";

import Main from "./Main";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 관리자 등기관리: 진행상태별 탭과 건수, 기간 검색, 결과 표 */
const meta = {
  title: "Pages/Admin/Registration/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "admin",
    docs: { story: { inline: false, height: "1000px" } },
    ...routeParameters("/admin/registration"),
  },
  decorators: [withCommonLayout],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

import { mobileViewport, routeParameters, withCommonLayout } from "@/stories/helpers";

import Main from "./Main";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 관리자 배정관리: 미배정·배정완료·진행보류·진행취소 탭과 의뢰번호 검색, 신규 등록 */
const meta = {
  title: "Pages/Admin/Assign/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "admin",
    docs: { story: { inline: false, height: "1000px" } },
    ...routeParameters("/admin/assign"),
  },
  decorators: [withCommonLayout],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

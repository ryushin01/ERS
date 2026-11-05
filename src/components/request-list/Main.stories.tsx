import { mobileViewport, routeParameters, withCommonLayout } from "@/stories/helpers";

import Main from "./Main";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 금융기관 의뢰목록: 미배정·배정완료·진행보류·진행취소 탭 */
const meta = {
  title: "Pages/Financial/RequestList/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "financial",
    docs: { story: { inline: false, height: "900px" } },
    ...routeParameters("/financial/request-list"),
  },
  decorators: [withCommonLayout],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

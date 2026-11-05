import { fn } from "storybook/test";

import { mobileViewport } from "@/stories/helpers";

import FilterTable from "./FilterTable";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 의뢰번호·진행상태·접수번호·채무자·기간으로 검색하는 조건 표 */
const meta = {
  title: "Pages/Financial/StatusInquiry/FilterTable",
  component: FilterTable,
  tags: ["autodocs"],
  parameters: { auth: "financial" },
  args: { isDesktop: true, setFilters: fn() },
} satisfies Meta<typeof FilterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

/** 헤더에서 의뢰번호로 검색해 들어온 경우 */
export const WithRequestNo: Story = { args: { rqstNo: "DEMO-002400" } };

export const Mobile: Story = { args: { isDesktop: false }, globals: mobileViewport };

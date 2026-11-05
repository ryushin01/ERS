import { routeParameters } from "@/stories/helpers";

import List from "./List";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 검색 조건(FilterTable)과 결과 표·페이지 이동 */
const meta = {
  title: "Pages/Financial/StatusInquiry/List",
  component: List,
  tags: ["autodocs"],
  parameters: { auth: "financial", ...routeParameters("/financial/status-inquiry") },
  args: { isDesktop: true },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import { routeParameters } from "@/stories/helpers";

import List from "./List";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 탭 하나의 의뢰 목록 (조회 + 표 + 페이지 이동) */
const meta = {
  title: "Financial/RequestList/List",
  component: List,
  tags: ["autodocs"],
  parameters: { auth: "financial", ...routeParameters("/financial/request-list") },
  args: { tabSelection: "00", isDesktop: true },
  argTypes: {
    tabSelection: {
      control: "inline-radio",
      options: ["00", "01", "02", "03"],
      description: "00 미배정 · 01 배정완료 · 02 진행보류 · 03 진행취소",
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotAssigned: Story = {};

export const Assigned: Story = { args: { tabSelection: "01" } };

export const Hold: Story = { args: { tabSelection: "02" } };

export const Canceled: Story = { args: { tabSelection: "03" } };

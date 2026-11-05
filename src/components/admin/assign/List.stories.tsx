import { fn } from "storybook/test";

import { routeParameters } from "@/stories/helpers";

import List from "./List";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 배정관리 탭 하나의 목록 (정렬·개수 선택 + 표 + 페이지 이동) */
const meta = {
  title: "Pages/Admin/Assign/List",
  component: List,
  tags: ["autodocs"],
  parameters: { auth: "admin", ...routeParameters("/admin/assign") },
  args: { tabIndex: "00", searchRqstNo: "", unMatchData: fn() },
  argTypes: {
    tabIndex: {
      control: "inline-radio",
      options: ["00", "01", "02", "03"],
      description: "00 미배정 · 01 배정완료 · 02 진행보류 · 03 진행취소",
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotAssigned: Story = {};

export const Assigned: Story = { args: { tabIndex: "01" } };

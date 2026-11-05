import { fn } from "storybook/test";

import { routeParameters } from "@/stories/helpers";

import List from "./List";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 등기관리 탭 하나의 목록 (검색 조건 + 정렬 + 표 + 페이지 이동) */
const meta = {
  title: "Pages/Admin/Registration/List",
  component: List,
  tags: ["autodocs"],
  parameters: { auth: "admin", ...routeParameters("/admin/registration") },
  args: { tabSelection: "", setTabCount: fn(), isDesktop: true },
  argTypes: {
    tabSelection: {
      control: "select",
      options: ["", "00", "20", "30", "40", "50", "60", "80", "70"],
      description: "빈 값은 전체, 나머지는 진행상태 코드",
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {};

export const Reviewing: Story = { args: { tabSelection: "40" } };

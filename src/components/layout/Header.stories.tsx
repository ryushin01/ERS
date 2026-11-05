import { mobileViewport, routeParameters } from "@/stories/helpers";

import Header from "./Header";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 로고와 (로그인 후) 의뢰번호 검색·계정 메뉴를 표시하는 상단 헤더 */
const meta = {
  title: "Patterns/Layout/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 로그인 화면: 로고만 표시 */
export const Login: Story = { parameters: routeParameters("/") };

export const Financial: Story = {
  parameters: { ...routeParameters("/financial/home"), auth: "financial" },
};

export const Admin: Story = {
  parameters: { ...routeParameters("/admin/assign"), auth: "admin" },
};

export const FinancialMobile: Story = { ...Financial, globals: mobileViewport };

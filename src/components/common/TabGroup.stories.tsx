import { fn } from "storybook/test";

import { mobileViewport } from "@/stories/helpers";

import TabGroup from "./TabGroup";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const panel = (text: string) => <div className="p-6 text-ers-grayscale-90">{text}</div>;

const meta = {
  title: "Common/TabGroup",
  component: TabGroup,
  tags: ["autodocs"],
  args: {
    isDesktop: true,
    onTabChange: fn(),
    items: [
      { label: "미배정", count: 8, content: panel("미배정 의뢰 목록") },
      { label: "배정완료", count: 12, content: panel("배정완료 의뢰 목록") },
      { label: "진행보류", count: 1, content: panel("진행보류 의뢰 목록") },
      { label: "진행취소", count: 0, content: panel("진행취소 의뢰 목록") },
    ],
  },
  argTypes: { items: { control: false } },
} satisfies Meta<typeof TabGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const SecondTabSelected: Story = { args: { defaultTab: 1 } };

export const Mobile: Story = { args: { isDesktop: false }, globals: mobileViewport };

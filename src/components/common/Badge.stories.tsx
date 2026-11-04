import Badge from "./Badge";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Common/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { type: "number", colorType: "default", children: 12 },
  argTypes: {
    type: { control: "inline-radio", options: ["number", "text"] },
    colorType: { control: "inline-radio", options: ["default", "active"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = { args: { colorType: "active" } };

/** 999를 넘으면 999+로 표시합니다. */
export const Overflow: Story = { args: { children: 1200, colorType: "active" } };

export const Text: Story = { args: { type: "text", children: "긴급" } };

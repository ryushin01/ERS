import { fn } from "storybook/test";

import { mobileViewport, routeParameters } from "@/stories/helpers";

import Error from "./Error";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 화면에서 오류가 났을 때 보여 주는 안내 (다시 시도·홈으로 이동) */
const meta = {
  title: "Patterns/Error/Error",
  component: Error,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", ...routeParameters("/financial/home") },
  args: { onReset: fn() },
} satisfies Meta<typeof Error>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Financial: Story = {};

export const Admin: Story = { parameters: routeParameters("/admin/assign") };

export const Mobile: Story = { globals: mobileViewport };

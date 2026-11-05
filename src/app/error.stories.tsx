import { fn } from "storybook/test";

import { mobileViewport, routeParameters } from "@/stories/helpers";

import RouteError from "./error";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 개별 에러 바운더리가 없는 페이지에서 오류가 났을 때의 화면 */
const meta = {
  title: "Error/RouteError",
  component: RouteError,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", ...routeParameters("/financial/home") },
  args: { error: new globalThis.Error("데모 오류"), reset: fn() },
  argTypes: { error: { control: false } },
} satisfies Meta<typeof RouteError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

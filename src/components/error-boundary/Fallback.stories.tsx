import { fn } from "storybook/test";

import { routeParameters } from "@/stories/helpers";

import Fallback from "./Fallback";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** react-error-boundary의 FallbackComponent. 오류 안내(Error)에 초기화 함수를 연결합니다. */
const meta = {
  title: "Error/Fallback",
  component: Fallback,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", ...routeParameters("/financial/home") },
  args: { error: new globalThis.Error("데모 오류"), resetErrorBoundary: fn() },
  argTypes: { error: { control: false } },
} satisfies Meta<typeof Fallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

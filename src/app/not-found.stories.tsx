import { mobileViewport, routeParameters } from "@/stories/helpers";

import NotFound from "./not-found";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 없는 주소로 들어왔을 때의 404 화면 */
const meta = {
  title: "Patterns/Error/NotFound",
  component: NotFound,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", ...routeParameters("/not-exist") },
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

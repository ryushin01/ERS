import { fn } from "storybook/test";

import DrawerHeader from "./DrawerHeader";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/drawer.css";

const meta = {
  title: "Components/Overlays/DrawerHeader",
  component: DrawerHeader,
  tags: ["autodocs"],
  args: { onClose: fn() },
  decorators: [
    (Story) => (
      <div className="w-[360px] border border-ers-grayscale-30 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DrawerHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import DrawerFooter from "./DrawerFooter";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/drawer.css";

/** 서비스 이용 문의 연락처 */
const meta = {
  title: "Components/Overlays/DrawerFooter",
  component: DrawerFooter,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[360px] border border-ers-grayscale-30 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

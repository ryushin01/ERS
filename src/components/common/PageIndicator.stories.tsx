import PageIndicator from "./PageIndicator";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/Navigation/PageIndicator",
  component: PageIndicator,
  tags: ["autodocs"],
  args: { total: 124, page: 3, limit: 10 },
} satisfies Meta<typeof PageIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { total: 0, page: 1 } };

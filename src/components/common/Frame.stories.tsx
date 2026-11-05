import Image from "next/image";

import Frame from "./Frame";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/Content/Frame",
  component: Frame,
  tags: ["autodocs"],
  args: { aspectRatio: "video", children: null },
  argTypes: {
    aspectRatio: { control: "inline-radio", options: ["square", "video", "inherit"] },
    children: { control: false },
  },
  render: (args) => (
    <div className="w-80 h-80">
      <Frame {...args}>
        <Image src="/images/desktop-banner-image.png" alt="배너 이미지" fill />
      </Frame>
    </div>
  ),
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Video: Story = {};

export const Square: Story = { args: { aspectRatio: "square" } };

export const Inherit: Story = { args: { aspectRatio: "inherit" } };

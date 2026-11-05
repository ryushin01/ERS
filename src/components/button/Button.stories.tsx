import Image from "next/image";
import { fn } from "storybook/test";

import { NarrowRightIcon } from "@icons20";

import Button from "./Button";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/Actions/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    shape: "solid",
    size: "md",
    color: "main100",
    children: "저장",
    onClick: fn(),
  },
  argTypes: {
    shape: { control: "inline-radio", options: ["solid", "outline", "none"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    color: {
      control: "select",
      options: ["main100", "main70", "main60", "main5", "grayscale", "bluegray"],
    },
    iconPosition: { control: "inline-radio", options: ["left", "right"] },
    icon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};

export const Outline: Story = {
  args: { shape: "outline", color: "grayscale", children: "취소" },
};

export const None: Story = {
  args: { shape: "none", children: "더보기" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithIcon: Story = {
  args: {
    children: "다음",
    iconPosition: "right",
    icon: <Image src={NarrowRightIcon} alt="" width={20} height={20} />,
  },
};

/** 모양·색상 조합을 한눈에 비교합니다. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-y-4">
      {(["solid", "outline", "none"] as const).map((shape) => (
        <div key={shape} className="flex flex-wrap items-center gap-3">
          {(["main100", "main70", "main60", "main5", "grayscale", "bluegray"] as const).map(
            (color) => (
              <div key={color} className="w-32">
                <Button {...args} shape={shape} color={color}>
                  {color}
                </Button>
              </div>
            ),
          )}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="w-32">
          <Button {...args} size={size}>
            {size}
          </Button>
        </div>
      ))}
    </div>
  ),
};

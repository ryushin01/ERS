import Image from "next/image";
import { fn } from "storybook/test";

import { CancelIcon, MenuIcon } from "@icons24";

import IconButton from "./IconButton";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 아이콘만 있는 버튼. children은 화면에 보이지 않고 버튼 이름(aria-label)으로 쓰이므로 필수입니다. */
const meta = {
  title: "Components/Actions/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    size: "md",
    children: "메뉴",
    onClick: fn(),
    icon: <Image src={MenuIcon} alt="" width={24} height={24} />,
  },
  argTypes: { size: { control: "inline-radio", options: ["md", "lg"] }, icon: { control: false } },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {};

export const Close: Story = {
  args: {
    size: "lg",
    children: "닫기",
    icon: <Image src={CancelIcon} alt="" width={24} height={24} />,
  },
};

export const Disabled: Story = { args: { disabled: true } };

import Image from "next/image";
import { fn } from "storybook/test";

import { LockIcon } from "@icons20";

import LoginPasswordField from "./LoginPasswordField";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 로그인 비밀번호 입력칸 (눈 아이콘으로 보이기·숨기기) */
const meta = {
  title: "Patterns/Login/LoginPasswordField",
  component: LoginPasswordField,
  tags: ["autodocs"],
  args: {
    type: "password",
    name: "pwd",
    defaultValue: "",
    placeholder: "비밀번호를 입력해 주세요",
    icon: <Image src={LockIcon} alt="" width={20} height={20} />,
    iconPosition: "left",
    inputSize: "lg",
    onFocus: fn(),
  },
  argTypes: { icon: { control: false } },
  decorators: [
    (Story) => (
      <div className="w-[460px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginPasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = { args: { isError: true, errorMessage: "비밀번호를 입력해 주세요." } };

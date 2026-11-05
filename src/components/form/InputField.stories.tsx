import Image from "next/image";
import { fn } from "storybook/test";

import { LockIcon, UserIcon } from "@icons20";

import InputField from "./InputField";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 라벨·아이콘·안내/오류 메시지를 함께 쓰는 입력칸 */
const meta = {
  title: "Components/Inputs/InputField",
  component: InputField,
  tags: ["autodocs"],
  args: {
    name: "id",
    type: "text",
    htmlFor: "story-input",
    labelText: "아이디",
    placeholder: "아이디를 입력해 주세요",
    inputSize: "md",
    onChange: fn(),
  },
  argTypes: {
    type: { control: "inline-radio", options: ["text", "password", "tel", "number"] },
    inputSize: { control: "inline-radio", options: ["sm", "md", "lg"] },
    iconPosition: { control: "inline-radio", options: ["left", "right"] },
    icon: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    labelText: "",
    htmlFor: "",
    icon: <Image src={UserIcon} alt="" width={20} height={20} />,
    iconPosition: "left",
    inputSize: "lg",
  },
};

/** 눈 아이콘으로 비밀번호를 보이거나 숨깁니다. */
export const Password: Story = {
  args: {
    type: "password",
    name: "pwd",
    labelText: "비밀번호",
    placeholder: "비밀번호를 입력해 주세요",
    icon: <Image src={LockIcon} alt="" width={20} height={20} />,
    iconPosition: "left",
  },
};

export const WithMessage: Story = {
  args: { inputMessage: "영문·숫자 조합 8자 이상 입력해 주세요." },
};

export const Error: Story = {
  args: { isError: true, errorMessage: "아이디를 입력해 주세요." },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "DEMO-002400", labelText: "의뢰번호" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-y-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <InputField
          key={size}
          {...args}
          htmlFor={`size-${size}`}
          inputSize={size}
          labelText={size}
        />
      ))}
    </div>
  ),
};

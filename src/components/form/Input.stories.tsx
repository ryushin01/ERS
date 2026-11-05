import { fn } from "storybook/test";

import Input from "./Input";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 라벨·메시지 없는 기본 입력칸. 보통은 InputField를 사용합니다. */
const meta = {
  title: "Components/Inputs/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    name: "debtor",
    type: "text",
    defaultValue: "",
    placeholder: "채무자 이름 입력",
    onChange: fn(),
  },
  argTypes: { type: { control: "inline-radio", options: ["text", "password", "tel", "number"] } },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: "김민준" } };

export const Error: Story = { args: { isError: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "수정할 수 없음" } };

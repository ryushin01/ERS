import { useState } from "react";

import { formatAmountInput } from "@utils/amountUtil";

import CurrencyFormat from "./CurrencyFormat";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 금액 입력칸. 원 단위 정수만 받고 천 단위 쉼표를 붙입니다. (utils/amountUtil) */
const meta = {
  title: "Components/Inputs/CurrencyFormat",
  component: CurrencyFormat,
  tags: ["autodocs"],
  args: {
    id: "bnd-max-amt",
    name: "price",
    value: "",
    placeholder: "채권최고액 입력",
    inputSize: "sm",
  },
  argTypes: { inputSize: { control: "inline-radio", options: ["sm", "md", "lg"] } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div className="w-[400px]">
        <CurrencyFormat
          {...args}
          value={value}
          onChange={(event) => setValue(formatAmountInput(event.target.value))}
        />
      </div>
    );
  },
} satisfies Meta<typeof CurrencyFormat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithValue: Story = { args: { value: "120,000,000" } };

export const Error: Story = { args: { isError: true } };

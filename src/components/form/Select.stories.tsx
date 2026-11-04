import { useState } from "react";

import { NUMERIC_SORT_OPTION, PERIOD_SORT_OPTION } from "@constants/option";

import Select from "./Select";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Form/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    id: "sort",
    name: "sort",
    value: PERIOD_SORT_OPTION[0].value,
    selectSize: "sm",
    options: PERIOD_SORT_OPTION,
  },
  argTypes: {
    selectSize: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    shape: { control: "inline-radio", options: ["default", "none"] },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div className="w-60">
        <Select {...args} value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
    );
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SortOrder: Story = {};

export const PageSize: Story = {
  args: {
    id: "size",
    name: "size",
    options: NUMERIC_SORT_OPTION,
    value: NUMERIC_SORT_OPTION[0].value,
  },
};

export const Placeholder: Story = { args: { value: "", placeholder: "선택해 주세요" } };

export const Error: Story = { args: { isError: true } };

export const Disabled: Story = { args: { disabled: true } };

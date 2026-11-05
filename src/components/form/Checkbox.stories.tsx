import { useState } from "react";
import { fn } from "storybook/test";

import Checkbox from "./Checkbox";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/Inputs/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { name: "id-saver", labelText: "아이디 저장", checked: false, onChange: fn() },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(event) => {
          setChecked(event.target.checked);
          args.onChange(event);
        }}
      />
    );
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = { args: { checked: true } };

export const Disabled: Story = { args: { disabled: true } };

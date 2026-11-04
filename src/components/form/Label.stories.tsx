import Input from "./Input";
import Label from "./Label";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Form/Label",
  component: Label,
  tags: ["autodocs"],
  args: { htmlFor: "story-label", labelText: "채무자", required: false, labelSize: "sm" },
  argTypes: { labelSize: { control: "inline-radio", options: ["sm", "md"] } },
  render: (args) => (
    <div className="w-[400px]">
      <Label {...args}>
        <Input
          id={args.htmlFor}
          name="debtor"
          type="text"
          defaultValue=""
          placeholder="이름 입력"
        />
      </Label>
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 필수 항목은 라벨 옆에 * 를 표시합니다. */
export const Required: Story = { args: { required: true } };

export const Medium: Story = { args: { labelSize: "md", required: true } };

export const Error: Story = { args: { isError: true } };

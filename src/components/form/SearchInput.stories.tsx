import { fn } from "storybook/test";

import SearchInput from "./SearchInput";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 헤더의 의뢰번호 검색칸 */
const meta = {
  title: "Form/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: { name: "searchRqstNo", placeholder: "의뢰번호 검색", onChange: fn(), onClick: fn() },
  decorators: [
    (Story) => (
      <div className="w-[335px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: "DEMO-002400" } };

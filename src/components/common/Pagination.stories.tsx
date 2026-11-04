import { useState } from "react";

import Pagination from "./Pagination";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Common/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: { total: 240, page: 1, limit: 10, pageCount: 10, setPage: () => {} },
  argTypes: { setPage: { control: false }, page: { control: false } },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} setPage={setPage} />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 페이지가 한 블록(pageCount) 안에 모두 들어가는 경우 */
export const FewPages: Story = { args: { total: 32 } };

export const MobileBlock: Story = { args: { pageCount: 5, limit: 5 } };

import { useState } from "react";

import { mobileViewport } from "@/stories/helpers";

import FilterTable from "./FilterTable";

import type { filterData } from "./List";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const INITIAL: filterData = {
  rqstNo: "",
  searchType: "EXEC",
  fromDate: "",
  toDate: "",
  searchTime: null,
};

/** 등기관리 검색 조건: 의뢰번호, 기간 기준(대출실행일 등), 기간 */
const meta = {
  title: "Pages/Admin/Registration/FilterTable",
  component: FilterTable,
  tags: ["autodocs"],
  parameters: { auth: "admin" },
  args: { filters: INITIAL, setFilters: () => {}, isDesktop: true },
  argTypes: { filters: { control: false }, setFilters: { control: false } },
  render: function Render(args) {
    const [filters, setFilters] = useState(args.filters);
    return (
      <div className="flex flex-col gap-y-4">
        <FilterTable {...args} filters={filters} setFilters={setFilters} />
        <pre className="p-3 rounded-lg bg-ers-grayscale-10 text-xs">
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    );
  },
} satisfies Meta<typeof FilterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { args: { isDesktop: false }, globals: mobileViewport };

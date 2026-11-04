import { getSupplimentListData } from "@services/adminAssign";
import { mobileViewport, routeParameters } from "@/stories/helpers";

import Table from "./Table";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 배정완료·진행보류·진행취소 표 (등기자료 팝업 포함) */
const meta = {
  title: "Admin/Assign/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { auth: "admin", ...routeParameters("/admin/assign") },
  loaders: [
    async () => ({
      list: (
        await getSupplimentListData({
          pageNum: 1,
          pageSize: 10,
          searchRqstNo: "",
          tabSelection: "01",
          sortOrder: "00",
        })
      ).data?.mtchList,
    }),
  ],
  args: { isDesktop: true, data: [] },
  argTypes: { data: { control: false } },
  render: (args, { loaded }) => <Table {...args} data={loaded.list ?? args.data} />,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { args: { isDesktop: false }, globals: mobileViewport };

import { getSupplimentListData } from "@services/adminAssign";
import { mobileViewport, routeParameters } from "@/stories/helpers";

import NotAllottedTable from "./NotAllottedTable";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 미배정 표. 행을 누르면 전자등기 배정 화면으로 이동합니다. */
const meta = {
  title: "Pages/Admin/Assign/NotAllottedTable",
  component: NotAllottedTable,
  tags: ["autodocs"],
  parameters: { auth: "admin", ...routeParameters("/admin/assign") },
  loaders: [
    async () => ({
      list: (
        await getSupplimentListData({
          pageNum: 1,
          pageSize: 10,
          searchRqstNo: "",
          tabSelection: "00",
          sortOrder: "00",
        })
      ).data?.mtchList,
    }),
  ],
  args: { isDesktop: true, data: [] },
  argTypes: { data: { control: false } },
  render: (args, { loaded }) => <NotAllottedTable {...args} data={loaded.list ?? args.data} />,
} satisfies Meta<typeof NotAllottedTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { args: { isDesktop: false }, globals: mobileViewport };

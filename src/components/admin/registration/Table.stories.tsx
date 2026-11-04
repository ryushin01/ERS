import { getRegistrationListData } from "@services/registrationManagement";
import { mobileViewport, routeParameters } from "@/stories/helpers";

import Table from "./Table";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 등기관리 결과 표. 등기자료·등기접수증 버튼, 행 클릭 시 상세·승인 화면으로 이동 */
const meta = {
  title: "Admin/Registration/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { auth: "admin", ...routeParameters("/admin/registration") },
  loaders: [
    async () => ({
      list: (
        await getRegistrationListData({
          tabSelection: "",
          rqstNo: "",
          searchType: "EXEC",
          fromDate: "",
          toDate: "",
          sortOrder: "00",
          page: 1,
          size: 10,
        })
      ).data?.data,
    }),
  ],
  args: { isDesktop: true, data: {} as never },
  argTypes: { data: { control: false } },
  render: (args, { loaded }) => <Table {...args} data={loaded.list ?? args.data} />,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { args: { isDesktop: false }, globals: mobileViewport };

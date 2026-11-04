import { fn } from "storybook/test";

import { getStasusListData } from "@services/statusInquiry";
import { mobileViewport } from "@/stories/helpers";

import Table from "./Table";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 현황조회 결과 표. 등기자료·등기접수증 버튼으로 상세 팝업을 엽니다. */
const meta = {
  title: "Financial/StatusInquiry/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { auth: "financial" },
  loaders: [
    async () => ({
      list: (
        await getStasusListData({
          page: 1,
          size: 10,
          rqstNo: "",
          statCd: "",
          acptNo: "",
          searchType: "EXEC",
          fromDate: "",
          toDate: "",
          dbtrNm: "",
        })
      ).data?.rgstrList,
    }),
  ],
  args: { isDesktop: true, data: [], setQueryTime: fn() },
  argTypes: { data: { control: false } },
  render: (args, { loaded }) => <Table {...args} data={loaded.list ?? args.data} />,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { args: { isDesktop: false }, globals: mobileViewport };

export const Empty: Story = { loaders: [async () => ({ list: [] })] };

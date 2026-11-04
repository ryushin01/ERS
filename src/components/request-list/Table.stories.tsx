import { fn } from "storybook/test";

import { getRequestListData } from "@services/request";
import { mobileViewport, routeParameters } from "@/stories/helpers";

import Table from "./Table";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const loadTab = (tabSelection: string) => async () => ({
  list: (await getRequestListData({ tabSelection, page: 1, size: 10 })).data?.data,
});

/** 의뢰목록 표. 상태별 버튼(보완필요 사유·등기자료·수정 등)을 누르면 팝업이 열립니다. */
const meta = {
  title: "Financial/RequestList/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { auth: "financial", ...routeParameters("/financial/request-list") },
  loaders: [loadTab("00")],
  args: { isDesktop: true, setQueryTime: fn(), data: { rqstList: [] } as never },
  argTypes: { data: { control: false } },
  render: (args, { loaded }) => <Table {...args} data={loaded.list ?? args.data} />,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotAssigned: Story = {};

export const Assigned: Story = { loaders: [loadTab("01")] };

export const Mobile: Story = { args: { isDesktop: false }, globals: mobileViewport };

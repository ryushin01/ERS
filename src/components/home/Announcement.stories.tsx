import { getHomeNoticeListData } from "@services/home";
import { mobileViewport } from "@/stories/helpers";

import Announcement from "./Announcement";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { HomeNoticeListResponse } from "@types";

/** 홈의 공지사항 표 (긴급 공지는 강조 표시) */
const meta = {
  title: "Financial/Home/Announcement",
  component: Announcement,
  tags: ["autodocs"],
  parameters: { auth: "financial" },
  loaders: [
    async () => ({
      list: ((await getHomeNoticeListData()) as HomeNoticeListResponse).data.homeBoardListRes,
    }),
  ],
  args: { data: [] },
  argTypes: { data: { control: false } },
  render: (args, { loaded }) => <Announcement data={loaded.list ?? args.data} />,
} satisfies Meta<typeof Announcement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

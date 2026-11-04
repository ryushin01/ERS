import { getHomeNoticeListData, getRegistrationListData } from "@services/home";
import { routeParameters } from "@/stories/helpers";

import Contents from "./Contents";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { HomeNoticeListResponse, HomeRegistrationListResponse } from "@types";

import "@styles/home.css";

/** 홈 하단: 실시간 등기현황 + 공지사항 (데이터는 데모 목업 API에서 받아 전달) */
const meta = {
  title: "Financial/Home/Contents",
  component: Contents,
  tags: ["autodocs"],
  parameters: { auth: "financial", ...routeParameters("/financial/home") },
  loaders: [
    async () => ({
      regiList: (await getRegistrationListData()) as HomeRegistrationListResponse,
      noticeList: (await getHomeNoticeListData()) as HomeNoticeListResponse,
    }),
  ],
  args: {
    isDesktop: true,
    getRegiListData: { data: { rgstrMasterList: [] } },
    getNoticeListData: { data: { homeBoardListRes: [] } },
  },
  argTypes: { getRegiListData: { control: false }, getNoticeListData: { control: false } },
  render: (args, { loaded }) => (
    <div className="_main">
      <div className="_contents-section">
        <Contents
          {...args}
          getRegiListData={loaded.regiList ?? args.getRegiListData}
          getNoticeListData={loaded.noticeList ?? args.getNoticeListData}
        />
      </div>
    </div>
  ),
} satisfies Meta<typeof Contents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 등기현황·공지사항이 없을 때 */
export const Empty: Story = { loaders: [async () => ({ regiList: null, noticeList: null })] };

import { PROC_STAT_CD } from "@constants/code";
import {
  mobileViewport,
  routeParameters,
  rqstNoByStatus,
  withCommonLayout,
} from "@/stories/helpers";

import Main from "./Main";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const rqstNo = rqstNoByStatus(PROC_STAT_CD.REQUEST);

/** 전자등기 배정: 등기자료 확인, 의뢰 정보 수정, 법무대리인 지정·보완요청·진행취소 */
const meta = {
  title: "Pages/Admin/AssignDetail/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "admin",
    docs: { story: { inline: false, height: "1200px" } },
    ...routeParameters(`/admin/assign/assign-detail/${rqstNo}`, { rqstNo }),
  },
  decorators: [withCommonLayout],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

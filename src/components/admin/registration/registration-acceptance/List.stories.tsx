import { PROC_STAT_CD } from "@constants/code";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import List from "./List";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const requestNo = rqstNoByStatus(PROC_STAT_CD.REVIEWING);

/** 등기접수증 승인 화면의 본문 (이미지 + 정보 표) */
const meta = {
  title: "Pages/Admin/RegistrationAcceptance/List",
  component: List,
  tags: ["autodocs"],
  parameters: {
    auth: "admin",
    docs: { story: { inline: false, height: "1000px" } },
    ...routeParameters(`/admin/registration/registration-acceptance/${requestNo}`),
  },
  args: { requestNo, isDesktop: true },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Compact: Story = { args: { isDesktop: false } };

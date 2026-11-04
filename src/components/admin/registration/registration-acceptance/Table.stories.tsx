import { PROC_STAT_CD } from "@constants/code";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import Table from "./Table";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const requestNo = rqstNoByStatus(PROC_STAT_CD.REVIEWING);

/** 등기접수증 정보 표와 승인·반려 버튼 */
const meta = {
  title: "Admin/RegistrationAcceptance/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    auth: "admin",
    docs: { story: { inline: false, height: "1000px" } },
    ...routeParameters(`/admin/registration/registration-acceptance/${requestNo}`),
  },
  args: { requestNo, isDesktop: true },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Compact: Story = { args: { isDesktop: false } };

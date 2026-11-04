import { PROC_STAT_CD } from "@constants/code";
import { rqstNoByStatus } from "@/stories/helpers";

import RegistrationReceiptDetail from "./RegistrationReceiptDetail";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 등기접수증 팝업의 정보 영역 (관리자) */
const meta = {
  title: "Admin/Registration/RegistrationReceiptDetail",
  component: RegistrationReceiptDetail,
  tags: ["autodocs"],
  parameters: { auth: "admin" },
  args: { requestNo: rqstNoByStatus(PROC_STAT_CD.COMPLET), isDesktop: true },
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RegistrationReceiptDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Compact: Story = { args: { isDesktop: false } };

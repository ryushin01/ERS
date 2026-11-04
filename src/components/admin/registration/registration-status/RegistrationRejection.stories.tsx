import { fn } from "storybook/test";

import { PROC_STAT_CD } from "@constants/code";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import RegistrationRejection from "./RegistrationRejection";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 등기접수증 반려 사유 선택 ("기타"는 직접 입력) */
const meta = {
  title: "Admin/RegistrationStatus/RegistrationRejection",
  component: RegistrationRejection,
  tags: ["autodocs"],
  parameters: { auth: "admin", ...routeParameters("/admin/registration/registration-acceptance") },
  args: { requestNo: rqstNoByStatus(PROC_STAT_CD.REVIEWING), closeRejectionModal: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-[436px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RegistrationRejection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

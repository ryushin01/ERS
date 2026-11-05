import { fn } from "storybook/test";

import { PROC_STAT_CD } from "@constants/code";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import RegistrationCancel from "./RegistrationCancel";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 진행취소 사유 선택 ("기타"는 직접 입력) */
const meta = {
  title: "Pages/Admin/RegistrationStatus/RegistrationCancel",
  component: RegistrationCancel,
  tags: ["autodocs"],
  parameters: { auth: "admin", ...routeParameters("/admin/registration/registration-detail") },
  args: { requstNo: rqstNoByStatus(PROC_STAT_CD.MATCH), closeCancelProgressModal: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-[436px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RegistrationCancel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

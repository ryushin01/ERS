import { fn } from "storybook/test";

import { PROC_STAT_CD } from "@constants/code";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import RegistrationInformation from "./RegistrationInformation";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 접수정보 등록 팝업: 관할법원·등기소·접수번호·접수일 입력과 등기접수증 업로드 */
const meta = {
  title: "Admin/RegistrationDetail/RegistrationInformation",
  component: RegistrationInformation,
  tags: ["autodocs"],
  parameters: {
    auth: "admin",
    docs: { story: { inline: false, height: "900px" } },
    ...routeParameters("/admin/registration/registration-detail"),
  },
  args: { requestNo: rqstNoByStatus(PROC_STAT_CD.EXECUTION), onClose: fn(), isDesktop: true },
  decorators: [
    (Story) => (
      <div className="max-w-[640px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RegistrationInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Compact: Story = { args: { isDesktop: false } };

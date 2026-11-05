import { fn } from "storybook/test";

import { PROC_STAT_CD } from "@constants/code";
import { rqstNoByStatus } from "@/stories/helpers";

import RegistrationDataDetail from "./RegistrationDataDetail";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 등기자료 팝업의 정보 영역 (금융기관) */
const meta = {
  title: "Pages/Financial/StatusInquiry/RegistrationDataDetail",
  component: RegistrationDataDetail,
  tags: ["autodocs"],
  parameters: { auth: "financial" },
  args: { requestNo: rqstNoByStatus(PROC_STAT_CD.MATCH), isDesktop: true, onClose: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RegistrationDataDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Matched: Story = {};

export const Completed: Story = { args: { requestNo: rqstNoByStatus(PROC_STAT_CD.COMPLET) } };

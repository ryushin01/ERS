import { fn } from "storybook/test";

import { PROC_STAT_CD } from "@constants/code";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import Detail from "./Detail";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 보완필요 팝업의 오른쪽 영역: 의뢰 정보, 보완 사유, 진행보류·수정 버튼 */
const meta = {
  title: "Financial/RequestList/Detail",
  component: Detail,
  tags: ["autodocs"],
  parameters: { auth: "financial", ...routeParameters("/financial/request-list") },
  args: { requestNo: rqstNoByStatus(PROC_STAT_CD.SUPPLEMENT), isDesktop: true, onClose: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Detail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Supplement: Story = {};

export const Compact: Story = { args: { isDesktop: false } };

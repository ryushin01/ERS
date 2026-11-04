import { PROC_STAT_CD } from "@constants/code";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import List from "./List";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 등기관리 상세 본문: 의뢰 정보, 등기자료·등기접수증, 진행 이력, 상태별 처리 버튼 */
const meta = {
  title: "Admin/RegistrationDetail/List",
  component: List,
  tags: ["autodocs"],
  parameters: {
    auth: "admin",
    docs: { story: { inline: false, height: "1100px" } },
    ...routeParameters("/admin/registration/registration-detail"),
  },
  args: { requestNo: rqstNoByStatus(PROC_STAT_CD.COMPLET), isDesktop: true },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completed: Story = {};

/** 대출실행 건: 접수정보 등록 버튼 */
export const Execution: Story = { args: { requestNo: rqstNoByStatus(PROC_STAT_CD.EXECUTION) } };

export const Reviewing: Story = { args: { requestNo: rqstNoByStatus(PROC_STAT_CD.REVIEWING) } };

import { PROC_STAT_CD } from "@constants/code";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import DesktopFileUploader from "./DesktopFileUploader";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** PC 업로드: 파일을 끌어다 놓거나 선택하고, 목록·용량을 확인한 뒤 의뢰합니다. */
const meta = {
  title: "Pages/Financial/Request/DesktopFileUploader",
  component: DesktopFileUploader,
  tags: ["autodocs"],
  parameters: { auth: "financial", ...routeParameters("/financial/request-list/request") },
  args: { requestNo: null },
} satisfies Meta<typeof DesktopFileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewRequest: Story = {};

export const EditRequest: Story = {
  args: { requestNo: rqstNoByStatus(PROC_STAT_CD.SUPPLEMENT) },
};

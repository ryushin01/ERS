import { PROC_STAT_CD } from "@constants/code";
import { mobileViewport, routeParameters, rqstNoByStatus } from "@/stories/helpers";

import MobileFileUploader from "./MobileFileUploader";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 모바일·태블릿 업로드: 사진 촬영(카메라) 또는 앨범에서 선택 */
const meta = {
  title: "Pages/Financial/Request/MobileFileUploader",
  component: MobileFileUploader,
  tags: ["autodocs"],
  parameters: { auth: "financial", ...routeParameters("/financial/request-list/request") },
  globals: mobileViewport,
  args: { requestNo: null, isMobile: true, isPortrait: true },
} satisfies Meta<typeof MobileFileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewRequest: Story = {};

export const EditRequest: Story = {
  args: { requestNo: rqstNoByStatus(PROC_STAT_CD.SUPPLEMENT) },
};

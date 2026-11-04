import { PROC_STAT_CD } from "@constants/code";
import {
  mobileViewport,
  routeParameters,
  rqstNoByStatus,
  withCommonLayout,
} from "@/stories/helpers";

import Main from "./Main";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 전자등기 의뢰: PC는 드래그 앤 드롭 업로드, 모바일은 사진 촬영·앨범 선택 */
const meta = {
  title: "Financial/Request/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "financial",
    docs: { story: { inline: false, height: "900px" } },
    ...routeParameters("/financial/request-list/request"),
  },
  decorators: [withCommonLayout],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 새 의뢰 */
export const NewRequest: Story = {};

/** 보완필요 건 수정 (?requestNo=...) — 기존 등기자료를 불러옵니다. */
export const EditRequest: Story = {
  parameters: routeParameters("/financial/request-list/request", {
    requestNo: rqstNoByStatus(PROC_STAT_CD.SUPPLEMENT),
  }),
};

export const Mobile: Story = { globals: mobileViewport };

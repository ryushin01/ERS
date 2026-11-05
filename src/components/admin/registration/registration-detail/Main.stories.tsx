import { PROC_STAT_CD } from "@constants/code";
import {
  mobileViewport,
  routeParameters,
  rqstNoByStatus,
  withCommonLayout,
} from "@/stories/helpers";

import Main from "./Main";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const rqstNo = rqstNoByStatus(PROC_STAT_CD.COMPLET);

/** 등기관리 상세: 의뢰 정보, 문서, 진행 이력, 접수정보 등록 */
const meta = {
  title: "Pages/Admin/RegistrationDetail/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "admin",
    docs: { story: { inline: false, height: "1200px" } },
    ...routeParameters(`/admin/registration/registration-detail/${rqstNo}`, { rqstNo }),
  },
  decorators: [withCommonLayout],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

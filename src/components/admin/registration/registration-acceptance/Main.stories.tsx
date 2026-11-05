import { PROC_STAT_CD } from "@constants/code";
import {
  mobileViewport,
  routeParameters,
  rqstNoByStatus,
  withCommonLayout,
} from "@/stories/helpers";

import Main from "./Main";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const rqstNo = rqstNoByStatus(PROC_STAT_CD.REVIEWING);

/** 등기접수증 승인: 접수증 이미지와 정보를 확인하고 승인·반려 */
const meta = {
  title: "Pages/Admin/RegistrationAcceptance/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "admin",
    docs: { story: { inline: false, height: "1200px" } },
    ...routeParameters(`/admin/registration/registration-acceptance/${rqstNo}`, { rqstNo }),
  },
  decorators: [withCommonLayout],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

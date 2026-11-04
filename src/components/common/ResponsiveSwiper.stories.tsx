import { ATTC_FIL_CD, PROC_STAT_CD } from "@constants/code";
import { rqstNoByStatus } from "@/stories/helpers";

import ResponsiveSwiper from "./ResponsiveSwiper";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 의뢰번호·첨부파일 코드로 등기자료 이미지를 조회해 슬라이드로 보여 줍니다. (데모 목업 API) */
const meta = {
  title: "Common/ResponsiveSwiper",
  component: ResponsiveSwiper,
  tags: ["autodocs"],
  parameters: { auth: "financial" },
  args: {
    requestNo: rqstNoByStatus(PROC_STAT_CD.MATCH),
    attachFileCode: ATTC_FIL_CD.REGISTRATION_DATA,
    isDesktop: true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[720px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResponsiveSwiper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RegistrationData: Story = {};

export const Mobile: Story = { args: { isDesktop: false } };

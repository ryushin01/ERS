import { fn } from "storybook/test";

import { MEMB_GB_CD } from "@constants/auth";

import AccountLayer from "./AccountLayer";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** PC 헤더의 계정 메뉴(비밀번호 변경·로그아웃·이용 문의) */
const meta = {
  title: "Patterns/Layout/AccountLayer",
  component: AccountLayer,
  tags: ["autodocs"],
  parameters: { auth: "financial", docs: { story: { inline: false, height: "520px" } } },
  args: {
    level: MEMB_GB_CD.FINANCIAL,
    profileData: "데모 금융기관",
    isModalOpen: false,
    onClose: fn(),
    openModal: fn(),
    closeModal: fn(),
  },
  decorators: [
    (Story) => (
      // 헤더의 사용자 이름 버튼 아래에 붙는 위치를 재현합니다.
      <div className="flex justify-end h-[540px] pr-10">
        <div className="relative h-10 px-3 leading-10 text-ers-grayscale-90">
          데모 금융기관
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof AccountLayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Financial: Story = {};

export const Admin: Story = {
  parameters: { auth: "admin" },
  args: { level: MEMB_GB_CD.ADMIN, profileData: "데모 관리자" },
};

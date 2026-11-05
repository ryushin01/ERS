import { useState } from "react";
import { fn } from "storybook/test";

import { MEMB_GB_CD } from "@constants/auth";

import DrawerContent from "./DrawerContent";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/drawer.css";

/** 프로필, 비밀번호 변경(모달), 로그아웃 영역. 드로어와 PC 계정 메뉴에서 함께 사용합니다. */
const meta = {
  title: "Components/Overlays/DrawerContent",
  component: DrawerContent,
  tags: ["autodocs"],
  parameters: { auth: "financial", docs: { story: { inline: false, height: "640px" } } },
  args: {
    level: MEMB_GB_CD.FINANCIAL,
    profileData: "데모 금융기관",
    closeModal: fn(),
  },
  render: function Render(args) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
      <div className="w-[360px] border border-ers-grayscale-30 rounded-xl">
        <DrawerContent
          {...args}
          isModalOpen={isModalOpen}
          openModal={() => setIsModalOpen(true)}
          closeModal={() => setIsModalOpen(false)}
        />
      </div>
    );
  },
} satisfies Meta<typeof DrawerContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Financial: Story = {};

export const Admin: Story = {
  parameters: { auth: "admin" },
  args: { level: MEMB_GB_CD.ADMIN, profileData: "데모 관리자" },
};

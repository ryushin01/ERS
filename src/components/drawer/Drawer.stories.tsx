import { fn } from "storybook/test";

import { MEMB_GB_CD } from "@constants/auth";
import { mobileViewport, Toggle } from "@/stories/helpers";

import Drawer from "./Drawer";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 모바일 헤더의 메뉴 버튼으로 여는 계정 드로어 (오른쪽에서 밀려 나옵니다) */
const meta = {
  title: "Drawer/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    auth: "financial",
    layout: "fullscreen",
    docs: { story: { inline: false, height: "720px" } },
  },
  globals: mobileViewport,
  args: {
    level: MEMB_GB_CD.FINANCIAL,
    profileData: "데모 금융기관",
    isModalOpen: false,
    onClose: fn(),
    openModal: fn(),
    closeModal: fn(),
  },
  render: (args) => (
    <div className="p-4">
      <Toggle label="드로어 열기">
        {(close) => (
          <Drawer
            {...args}
            onClose={() => {
              close();
              args.onClose();
            }}
          />
        )}
      </Toggle>
    </div>
  ),
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Financial: Story = {};

export const Admin: Story = {
  parameters: { auth: "admin" },
  args: { level: MEMB_GB_CD.ADMIN, profileData: "데모 관리자" },
};

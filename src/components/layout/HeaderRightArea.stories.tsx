import { mobileViewport, routeParameters } from "@/stories/helpers";

import HeaderRightArea from "./HeaderRightArea";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * 헤더 오른쪽 영역: 의뢰번호 검색, 사용자 이름(계정 메뉴), 로그아웃.
 * 모바일에서는 메뉴 버튼으로 드로어를 엽니다.
 */
const meta = {
  title: "Layout/HeaderRightArea",
  component: HeaderRightArea,
  tags: ["autodocs"],
  parameters: { docs: { story: { inline: false, height: "560px" } } },
  decorators: [
    (Story) => (
      <header className="_header">
        <div className="_header-inner-wrap justify-end">
          <Story />
        </div>
      </header>
    ),
  ],
} satisfies Meta<typeof HeaderRightArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Financial: Story = {
  parameters: { ...routeParameters("/financial/home"), auth: "financial" },
};

export const Admin: Story = {
  parameters: { ...routeParameters("/admin/assign"), auth: "admin" },
};

export const Mobile: Story = { ...Financial, globals: mobileViewport };

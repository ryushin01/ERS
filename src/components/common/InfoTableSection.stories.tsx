import InfoTableSection from "./InfoTableSection";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/responsive-table.css";

/** 등기자료·등기접수증 팝업에서 쓰는 "제목 + 항목/값" 표 */
const meta = {
  title: "Components/Content/InfoTableSection",
  component: InfoTableSection,
  tags: ["autodocs"],
  args: {
    title: "의뢰 정보",
    isDesktop: true,
    rows: [
      [
        { label: "의뢰번호", value: "DEMO-002400" },
        { label: "진행상태", value: "배정완료" },
      ],
      [
        { label: "채무자", value: "김민준" },
        { label: "채권최고액", value: "120,000,000원" },
      ],
      { label: "부동산 주소", value: "서울특별시 중구 세종대로 110 (태평로1가)" },
    ],
  },
} satisfies Meta<typeof InfoTableSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { args: { isDesktop: false } };

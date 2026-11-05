import { mobileViewport } from "@/stories/helpers";

import Accordion from "./Accordion";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 공지사항 한 건. 제목을 누르면 내용과 첨부파일이 펼쳐집니다. */
const meta = {
  title: "Components/Content/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { auth: "financial" },
  args: {
    id: 12,
    title: "전자등기 의뢰 시 등기자료 촬영 가이드",
    author: "관리자",
    date: "2026.11.02",
    description:
      "계약서는 모든 페이지가 선명하게 보이도록 촬영해 주세요. 빛 반사와 그림자가 생기지 않도록 주의해 주세요.",
    isUrgent: false,
    fileInfoList: [],
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 긴급 공지는 빨간 경고 아이콘과 함께 표시합니다. */
export const Urgent: Story = {
  args: {
    id: 13,
    title: "[긴급] 등기소 전산 점검에 따른 접수 지연 안내",
    isUrgent: true,
    description: "등기소 전산 점검으로 인해 금일 18시 이후 접수 건은 익영업일에 처리됩니다.",
  },
};

export const WithAttachment: Story = {
  args: {
    title: "개인정보 처리방침 개정 안내",
    fileInfoList: [
      { seq: "NOTICE-3", filIdx: 1, attcFilNm: "개인정보처리방침_개정안.pdf", fileSize: "120KB" },
    ],
  },
};

export const Mobile: Story = { globals: mobileViewport, args: Urgent.args };

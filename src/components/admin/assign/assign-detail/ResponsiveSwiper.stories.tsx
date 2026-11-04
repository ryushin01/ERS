import { fn } from "storybook/test";

import { createDocumentSvg } from "@/mocks/data";

import ResponsiveSwiper from "./ResponsiveSwiper";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const image = (page: number) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createDocumentSvg("등기자료", "DEMO-002400", page))}`;

/**
 * 배정 화면의 등기자료 슬라이드.
 * 서버 이미지(source: "api")와 새로 추가한 이미지(source: "prop")를 함께 보여 주며, 새 이미지만 삭제할 수 있습니다.
 */
const meta = {
  title: "Admin/AssignDetail/ResponsiveSwiper",
  component: ResponsiveSwiper,
  tags: ["autodocs"],
  args: {
    requestNo: "DEMO-002400",
    isDesktop: true,
    apiImageLength: 0,
    handleFileDelete: fn(),
    imageList: [1, 2, 3].map((page) => ({
      seq: "DEMO-002400",
      filIdx: String(page),
      src: image(page),
      attcFilNm: `추가_${page}.svg`,
      source: "prop" as const,
    })),
  },
  argTypes: { imageList: { control: false } },
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

export const NewImages: Story = {};

export const Mobile: Story = { args: { isDesktop: false } };

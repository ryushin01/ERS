import { useState } from "react";

import { createDocumentSvg } from "@/mocks/data";

import ResponsiveSwiper from "./ResponsiveSwiper";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const IMAGES = [1, 2, 3].map(
  (page) =>
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createDocumentSvg("등기자료", "신규", page))}`,
);

/** 신규 등록 시 업로드한 이미지 미리보기 (개별 삭제 가능) */
const meta = {
  title: "Pages/Admin/AssignCreate/ResponsiveSwiper",
  component: ResponsiveSwiper,
  tags: ["autodocs"],
  args: { imageList: IMAGES, handleFileDelete: () => {} },
  argTypes: { imageList: { control: false }, handleFileDelete: { control: false } },
  render: function Render(args) {
    const [imageList, setImageList] = useState(args.imageList);
    return (
      <div className="max-w-[720px]">
        <ResponsiveSwiper
          imageList={imageList}
          handleFileDelete={(index) => setImageList((prev) => prev.filter((_, i) => i !== index))}
        />
      </div>
    );
  },
} satisfies Meta<typeof ResponsiveSwiper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

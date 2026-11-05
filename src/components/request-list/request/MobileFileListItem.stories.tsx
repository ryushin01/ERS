import { useState } from "react";

import { createDocumentSvg } from "@/mocks/data";

import MobileFileListItem from "./MobileFileListItem";

import type { FileProps } from "./MobileFileUploader";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/file-uploader.css";

const IMAGES: FileProps[] = [1, 2, 3].map((page) => ({
  uid: `image-${page}`,
  attcFilNm: `등기자료_${page}.svg`,
  src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createDocumentSvg("등기자료", "DEMO-002400", page))}`,
}));

/** 모바일 업로드 미리보기 썸네일 (삭제 버튼 포함) */
const meta = {
  title: "Pages/Financial/Request/MobileFileListItem",
  component: MobileFileListItem,
  tags: ["autodocs"],
  args: {
    imageList: IMAGES,
    fileList: [],
    setImageList: () => {},
    setFileList: () => {},
    setIsExistingImageList: () => {},
  },
  argTypes: {
    imageList: { control: false },
    fileList: { control: false },
    setImageList: { control: false },
    setFileList: { control: false },
    setIsExistingImageList: { control: false },
  },
  render: function Render(args) {
    const [imageList, setImageList] = useState(args.imageList);
    const [fileList, setFileList] = useState<File[]>([]);
    return (
      <div className="_mobile-file-uploader-wrapper max-w-[375px]">
        <ul className="_mobile-file-list">
          <MobileFileListItem
            imageList={imageList}
            setImageList={setImageList}
            fileList={fileList}
            setFileList={setFileList}
            setIsExistingImageList={() => {}}
          />
        </ul>
      </div>
    );
  },
} satisfies Meta<typeof MobileFileListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

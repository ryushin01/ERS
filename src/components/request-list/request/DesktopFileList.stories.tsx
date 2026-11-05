import { useState } from "react";

import DesktopFileList from "./DesktopFileList";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { FileData } from "@types";

import "@styles/file-uploader.css";

const FILES: FileData[] = [
  { uid: "1", attcFilNm: "근저당권설정계약서_1.jpg", filSize: 1_240_000 },
  { uid: "2", attcFilNm: "근저당권설정계약서_2.jpg", filSize: 980_000 },
  { uid: "3", attcFilNm: "신분증_사본.png", filSize: 420_000 },
];

/** 업로드할 파일 목록과 전체 사용량. 항목마다 삭제할 수 있습니다. */
const meta = {
  title: "Pages/Financial/Request/DesktopFileList",
  component: DesktopFileList,
  tags: ["autodocs"],
  args: { fileList: FILES, handleRemove: () => {} },
  argTypes: { fileList: { control: false }, handleRemove: { control: false } },
  render: function Render(args) {
    const [fileList, setFileList] = useState(args.fileList);
    return (
      <div className="max-w-[640px]">
        <DesktopFileList
          fileList={fileList}
          handleRemove={(file) =>
            setFileList((prev) => prev.filter((item) => item.uid !== file.uid))
          }
        />
      </div>
    );
  },
} satisfies Meta<typeof DesktopFileList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

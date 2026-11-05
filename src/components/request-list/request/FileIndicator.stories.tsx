import FileIndicator from "./FileIndicator";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/file-uploader.css";

/** 업로드한 파일 수 / 최대 파일 수 */
const meta = {
  title: "Pages/Financial/Request/FileIndicator",
  component: FileIndicator,
  tags: ["autodocs"],
  args: { count: 3, total: 10 },
} satisfies Meta<typeof FileIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Full: Story = { args: { count: 10 } };

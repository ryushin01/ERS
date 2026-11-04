import { getNoticeBoardList } from "@services/home";

import List from "./List";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 공지사항 아코디언 목록 */
const meta = {
  title: "Financial/Notice/List",
  component: List,
  tags: ["autodocs"],
  parameters: { auth: "financial" },
  loaders: [
    async () => ({ list: (await getNoticeBoardList({ page: 1, size: 10 })).data.data.boardList }),
  ],
  args: { data: [] },
  argTypes: { data: { control: false } },
  render: (args, { loaded }) => <List data={loaded.list ?? args.data} />,
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import { routeParameters } from "@/stories/helpers";

import CreateForm from "./CreateForm";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * 전자등기 신규 등록 폼: 등기자료 이미지 업로드, 금융기관·채무자·대출실행일·채권최고액·주소 입력, 법무대리인 지정.
 * 필수 항목을 비운 채 등록하면 오류 표시가 됩니다.
 */
const meta = {
  title: "Admin/AssignCreate/CreateForm",
  component: CreateForm,
  tags: ["autodocs"],
  parameters: {
    auth: "admin",
    docs: { story: { inline: false, height: "1100px" } },
    ...routeParameters("/admin/assign/assign-create"),
  },
} satisfies Meta<typeof CreateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

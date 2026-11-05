import { PROC_STAT_CD } from "@constants/code";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import DetailForm from "./DetailForm";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const rqstNo = rqstNoByStatus(PROC_STAT_CD.REQUEST);

/** 배정 화면의 본문: 등기자료 이미지(추가 업로드) + 의뢰 정보 표 */
const meta = {
  title: "Pages/Admin/AssignDetail/DetailForm",
  component: DetailForm,
  tags: ["autodocs"],
  parameters: {
    auth: "admin",
    docs: { story: { inline: false, height: "1100px" } },
    ...routeParameters(`/admin/assign/assign-detail/${rqstNo}`, { rqstNo }),
  },
  args: { rqstNo, isDesktop: true },
} satisfies Meta<typeof DetailForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Request: Story = {};

export const Supplement: Story = { args: { rqstNo: rqstNoByStatus(PROC_STAT_CD.SUPPLEMENT) } };

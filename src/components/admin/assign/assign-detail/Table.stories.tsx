import { PROC_STAT_CD, REALE_CD } from "@constants/code";
import { getSupplimentData } from "@services/adminAssign";
import { getMemberListData } from "@services/assignDetail";
import { getCommonCodeList } from "@services/common";
import { routeParameters, rqstNoByStatus } from "@/stories/helpers";

import Table from "./Table";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const rqstNo = rqstNoByStatus(PROC_STAT_CD.REQUEST);

/** 배정 화면의 의뢰 정보 표: 정보 수정, 법무대리인 지정, 보완요청·진행취소·배정 버튼 */
const meta = {
  title: "Admin/AssignDetail/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    auth: "admin",
    docs: { story: { inline: false, height: "1000px" } },
    ...routeParameters(`/admin/assign/assign-detail/${rqstNo}`, { rqstNo }),
  },
  loaders: [
    async () => ({
      detail: (await getSupplimentData(rqstNo)).data,
      realeGbCd: (await getCommonCodeList(REALE_CD)).data?.data?.commCodeList ?? [],
      membList: (await getMemberListData("10")).data ?? [],
    }),
  ],
  args: { requstNo: rqstNo, data: {} as never, realeGbCd: [], membList: [], imageList: [] },
  argTypes: {
    data: { control: false },
    realeGbCd: { control: false },
    membList: { control: false },
    imageList: { control: false },
  },
  render: (args, { loaded }) => (
    <div className="max-w-[720px]">
      <Table
        {...args}
        data={loaded.detail ?? args.data}
        realeGbCd={loaded.realeGbCd}
        membList={loaded.membList}
      />
    </div>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 등기자료 이미지 개수·용량 제한을 넘은 경우 */
export const FileLimitExceeded: Story = {
  args: { isUploadDisabled: true, isMaxFileExceeded: true },
};

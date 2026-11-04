import { PROC_STAT_CD } from "@constants/code";
import { getRegistrationData } from "@services/registrationManagement";
import { rqstNoByStatus } from "@/stories/helpers";

import RegistrationDataView from "./RegistrationDataView";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const requestNo = rqstNoByStatus(PROC_STAT_CD.COMPLET);

/** 등기자료 상세 표시 영역 (금융기관·관리자 공통). 데이터는 상위에서 조회해 전달합니다. */
const meta = {
  title: "Registration/RegistrationDataView",
  component: RegistrationDataView,
  tags: ["autodocs"],
  loaders: [async () => ({ detail: (await getRegistrationData(requestNo)).data?.data })],
  args: { requestNo, variant: "financial", isDesktop: true },
  argTypes: { variant: { control: "inline-radio", options: ["financial", "admin"] } },
  render: (args, { loaded }) => (
    <div className="max-w-[560px]">
      <RegistrationDataView {...args} data={loaded.detail} />
    </div>
  ),
} satisfies Meta<typeof RegistrationDataView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Financial: Story = {};

export const Admin: Story = { args: { variant: "admin" } };

export const Compact: Story = { args: { isDesktop: false } };

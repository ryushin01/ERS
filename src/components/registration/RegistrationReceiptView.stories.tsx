import { PROC_STAT_CD } from "@constants/code";
import { getRegistrationAcceptData } from "@services/registrationManagement";
import { rqstNoByStatus } from "@/stories/helpers";

import RegistrationReceiptView from "./RegistrationReceiptView";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const requestNo = rqstNoByStatus(PROC_STAT_CD.COMPLET);

/** 등기접수증 상세 표시 영역 (금융기관·관리자 공통) */
const meta = {
  title: "Patterns/Registration/RegistrationReceiptView",
  component: RegistrationReceiptView,
  tags: ["autodocs"],
  loaders: [async () => ({ detail: (await getRegistrationAcceptData(requestNo)).data?.data })],
  args: { requestNo, variant: "financial", isDesktop: true },
  argTypes: { variant: { control: "inline-radio", options: ["financial", "admin"] } },
  render: (args, { loaded }) => (
    <div className="max-w-[560px]">
      <RegistrationReceiptView {...args} data={loaded.detail} />
    </div>
  ),
} satisfies Meta<typeof RegistrationReceiptView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Financial: Story = {};

export const Admin: Story = { args: { variant: "admin" } };

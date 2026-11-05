import { getRegistrationListData } from "@services/home";
import { mobileViewport } from "@/stories/helpers";

import RegistrationStatus from "./RegistrationStatus";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { HomeRegistrationListResponse } from "@types";

/** 홈의 실시간 등기현황 표 */
const meta = {
  title: "Pages/Financial/Home/RegistrationStatus",
  component: RegistrationStatus,
  tags: ["autodocs"],
  parameters: { auth: "financial" },
  loaders: [
    async () => ({
      list: ((await getRegistrationListData()) as HomeRegistrationListResponse).data
        .rgstrMasterList,
    }),
  ],
  args: { data: [] },
  argTypes: { data: { control: false } },
  render: (args, { loaded }) => <RegistrationStatus data={loaded.list ?? args.data} />,
} satisfies Meta<typeof RegistrationStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };

import { routeParameters } from "@/stories/helpers";

import Breadcrumb from "./Breadcrumb";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 현재 경로(usePathname)로 메뉴 위치를 표시합니다. */
const meta = {
  title: "Components/Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FinancialRequest: Story = {
  parameters: routeParameters("/financial/request-list/request"),
};

export const FinancialNotice: Story = {
  parameters: routeParameters("/financial/home/notice"),
};

export const AdminAssignCreate: Story = {
  parameters: routeParameters("/admin/assign/assign-create"),
};

export const AdminRegistrationDetail: Story = {
  parameters: routeParameters("/admin/registration/registration-detail/DEMO-002400"),
};

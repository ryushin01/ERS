import { Typography } from "@components/common";
import { mobileViewport, routeParameters } from "@/stories/helpers";

import CommonLayout from "./CommonLayout";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 로그인 후 화면의 공통 틀: 헤더 + 메뉴(GNB) + 본문 + 푸터 */
const meta = {
  title: "Patterns/Layout/CommonLayout",
  component: CommonLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    auth: "financial",
    docs: { story: { inline: false, height: "640px" } },
    ...routeParameters("/financial/home"),
  },
  args: {
    children: (
      <section className="flex flex-col gap-y-4 py-8">
        <Typography as="h2" kind="headline-small" isBold>
          본문 영역
        </Typography>
        <div className="h-80 rounded-2xl border border-dashed border-ers-grayscale-40" />
      </section>
    ),
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof CommonLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Financial: Story = {};

export const Admin: Story = {
  parameters: { auth: "admin", ...routeParameters("/admin/assign") },
};

export const Mobile: Story = { globals: mobileViewport };

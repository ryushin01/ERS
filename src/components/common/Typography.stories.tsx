import Typography from "./Typography";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const KINDS = [
  "headline-large",
  "headline-medium",
  "headline-small",
  "title-large",
  "title-medium",
  "title-small",
  "body-large",
  "body-medium",
  "body-small",
  "caption-large",
  "caption-medium",
  "caption-small",
  "error-title",
  "error-subtitle",
  "error-text",
] as const;

const meta = {
  title: "Foundations/Typography",
  component: Typography,
  tags: ["autodocs"],
  args: { kind: "title-medium", children: "전자등기 관리 시스템", isBold: false },
  argTypes: {
    kind: { control: "select", options: KINDS },
    as: { control: "select", options: ["span", "p", "h1", "h2", "h3", "strong"] },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 디자인 시스템의 글자 크기 단계 전체 */
export const Scale: Story = {
  render: (args) => (
    <div className="flex flex-col gap-y-3">
      {KINDS.map((kind) => (
        <div key={kind} className="flex items-baseline gap-x-6">
          <code className="w-36 shrink-0 text-xs text-ers-grayscale-70">{kind}</code>
          <Typography {...args} kind={kind}>
            의뢰부터 승인까지 한곳에서
          </Typography>
        </div>
      ))}
    </div>
  ),
};

export const Bold: Story = { args: { isBold: true, kind: "headline-small" } };

import Loading from "./Loading";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** API 요청 중 화면 전체를 덮는 로딩 스피너 */
const meta = {
  title: "Components/Feedback/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, height: "240px" } } },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

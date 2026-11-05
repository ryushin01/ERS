import { mobileViewport, routeParameters } from "@/stories/helpers";

import Gnb from "./Gnb";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 사용자 유형별 메뉴. PC는 왼쪽 세로 메뉴, 모바일은 하단 탭 바로 표시합니다. */
const meta = {
  title: "Patterns/Layout/Gnb",
  component: Gnb,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, height: "480px" } } },
  decorators: [
    (Story) => (
      // 헤더 없이 메뉴만 보여 주므로 헤더 높이(100px)만큼 내려가 있는 위치를 맨 위로 맞춥니다.
      <div className="gnb-story relative h-[480px]">
        <style>{".gnb-story ._gnb { top: 0; }"}</style>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Gnb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Financial: Story = { parameters: routeParameters("/financial/request-list") };

export const Admin: Story = { parameters: routeParameters("/admin/registration") };

export const Mobile: Story = {
  parameters: routeParameters("/financial/home"),
  globals: mobileViewport,
};

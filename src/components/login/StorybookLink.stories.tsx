import { useEffect, useState } from "react";

import { Button } from "@components/button";
import { mobileViewport } from "@/stories/helpers";

import StorybookLink, { STORYBOOK_TRANSITION_MS, StorybookTransition } from "./StorybookLink";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/login.css";

/**
 * 로그인 화면의 Storybook 바로 가기 버튼.
 * 누르면 버튼 위치에서 화면이 펼쳐지고 컴포넌트 조각이 격자로 모인 뒤 Storybook으로 이동합니다.
 */
const meta = {
  title: "Login/StorybookLink",
  component: StorybookLink,
  tags: ["autodocs"],
  args: { isDesktop: true },
  decorators: [
    (Story) => (
      <div className="max-w-[460px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StorybookLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { args: { isDesktop: false }, globals: mobileViewport };

/** 전환 애니메이션만 반복해서 확인합니다. (실제 이동은 하지 않음) */
export const Transition: Story = {
  parameters: { docs: { story: { inline: false, height: "560px" } } },
  render: function Render() {
    const [playCount, setPlayCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    // 애니메이션(1.4초)이 끝나면 전환 화면을 닫아 "다시 재생" 버튼을 누를 수 있게 합니다.
    useEffect(() => {
      const timer = window.setTimeout(() => setIsPlaying(false), STORYBOOK_TRANSITION_MS + 400);
      return () => window.clearTimeout(timer);
    }, [playCount]);

    return (
      <>
        <div className="w-40">
          <Button
            shape="solid"
            size="md"
            color="main100"
            onClick={() => {
              setIsPlaying(true);
              setPlayCount((count) => count + 1);
            }}
          >
            다시 재생
          </Button>
        </div>
        {isPlaying && <StorybookTransition key={playCount} origin={{ x: 80, y: 36 }} />}
      </>
    );
  },
};

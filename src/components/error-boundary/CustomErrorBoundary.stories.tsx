import { useState } from "react";

import { Button } from "@components/button";
import { routeParameters } from "@/stories/helpers";

import CustomErrorBoundary from "./CustomErrorBoundary";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function Bomb() {
  const [shouldThrow, setShouldThrow] = useState(false);
  if (shouldThrow) {
    throw new Error("렌더링 중 오류 (데모)");
  }
  return (
    <div className="w-60">
      <Button shape="solid" size="md" color="main100" onClick={() => setShouldThrow(true)}>
        오류 발생시키기
      </Button>
    </div>
  );
}

/** 하위 화면의 렌더링 오류를 잡아 오류 안내(Fallback)로 바꿔 보여 줍니다. */
const meta = {
  title: "Error/CustomErrorBoundary",
  component: CustomErrorBoundary,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", ...routeParameters("/financial/home") },
  args: { element: <Bomb /> },
  argTypes: { element: { control: false } },
} satisfies Meta<typeof CustomErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

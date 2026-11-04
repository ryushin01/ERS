import ImageWithAuth from "./ImageWithAuth";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * 인증 헤더가 필요한 이미지를 axios로 받아 표시합니다.
 * 받지 못하면 기본 프로필 이미지(fallbackSrc)를 보여 줍니다.
 */
const meta = {
  title: "Common/ImageWithAuth",
  component: ImageWithAuth,
  tags: ["autodocs"],
  args: { src: "/not-found-image", alt: "프로필 이미지", width: 64, height: 64 },
} satisfies Meta<typeof ImageWithAuth>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 이미지를 받지 못한 경우 기본 이미지 */
export const Fallback: Story = {};

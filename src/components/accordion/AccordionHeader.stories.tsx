import AccordionHeader from "./AccordionHeader";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 공지사항 목록의 열 제목 (PC에서만 표시) */
const meta = {
  title: "Accordion/AccordionHeader",
  component: AccordionHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof AccordionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import Grid from "./Grid";
import GridItem from "./GridItem";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const Cell = ({ children }: { children: string }) => (
  <div className="py-4 rounded-lg bg-ers-main-10 text-center text-ers-main-100">{children}</div>
);

/** 12단 반응형 그리드. GridItem에 모바일·태블릿·PC별 칸 수를 지정합니다. */
const meta = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  render: (args) => (
    <Grid {...args}>
      <GridItem mobile={12} tablet={6} desktop={3}>
        <Cell>12 / 6 / 3</Cell>
      </GridItem>
      <GridItem mobile={12} tablet={6} desktop={3}>
        <Cell>12 / 6 / 3</Cell>
      </GridItem>
      <GridItem mobile={6} tablet={6} desktop={3}>
        <Cell>6 / 6 / 3</Cell>
      </GridItem>
      <GridItem mobile={6} tablet={6} desktop={3}>
        <Cell>6 / 6 / 3</Cell>
      </GridItem>
      <GridItem mobile={12} tablet={12} desktop={12}>
        <Cell>12 / 12 / 12</Cell>
      </GridItem>
    </Grid>
  ),
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

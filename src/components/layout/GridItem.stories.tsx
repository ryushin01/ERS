import Grid from "./Grid";
import GridItem from "./GridItem";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 그리드 한 칸. 화면 크기별 차지할 칸 수(1~12)를 지정합니다. */
const meta = {
  title: "Components/Layout/GridItem",
  component: GridItem,
  tags: ["autodocs"],
  args: { mobile: 12, tablet: 6, desktop: 4 },
  argTypes: {
    mobile: { control: { type: "range", min: 1, max: 12 } },
    tablet: { control: { type: "range", min: 1, max: 12 } },
    desktop: { control: { type: "range", min: 1, max: 12 } },
  },
  render: (args) => (
    <Grid>
      <GridItem {...args}>
        <div className="py-4 rounded-lg bg-ers-main-100 text-center text-ers-grayscale-0">
          {`${args.mobile} / ${args.tablet} / ${args.desktop}`}
        </div>
      </GridItem>
    </Grid>
  ),
} satisfies Meta<typeof GridItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

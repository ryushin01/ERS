import { fn } from "storybook/test";

import { Toggle } from "@/stories/helpers";

import AddressSearchModal from "./AddressSearchModal";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** 다음(카카오) 우편번호 서비스로 주소를 검색하는 모달. 주소를 고르면 지번·도로명 주소를 넘겨줍니다. */
const meta = {
  title: "Admin/Assign/AddressSearchModal",
  component: AddressSearchModal,
  tags: ["autodocs"],
  parameters: { docs: { story: { inline: false, height: "720px" } } },
  args: { onSelect: fn(), onClose: fn() },
  render: (args) => (
    <Toggle label="주소 검색 열기">
      {(close) => (
        <AddressSearchModal
          onSelect={args.onSelect}
          onClose={() => {
            close();
            args.onClose();
          }}
        />
      )}
    </Toggle>
  ),
} satisfies Meta<typeof AddressSearchModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import { CustomErrorBoundary } from "@components/error-boundary";
import { CommonLayout } from "@components/layout";
import Main from "@components/status-inquiry/Main";
import { FI_STATUS_INQUIRY_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: FI_STATUS_INQUIRY_METADATA.TITLE,
  description: FI_STATUS_INQUIRY_METADATA.DESCRIPTION,
};

export default function StatusInquiry() {
  return (
    <CommonLayout>
      <CustomErrorBoundary element={<Main />} />
    </CommonLayout>
  );
}

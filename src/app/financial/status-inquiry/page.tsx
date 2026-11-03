import type { Metadata } from "next";
import { FI_STATUS_INQUIRY_METADATA } from "@constants/metadata";
import { CommonLayout } from "@components/layout";
import { CustomErrorBoundary } from "@components/error-boundary";
import Main from "@components/status-inquiry/Main";

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
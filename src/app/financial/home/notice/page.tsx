import { CustomErrorBoundary } from "@components/error-boundary";
import { CommonLayout } from "@components/layout";
import Main from "@components/notice/financial/Main";
import { FI_NOTICE_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: FI_NOTICE_METADATA.TITLE,
  description: FI_NOTICE_METADATA.DESCRIPTION,
};

export default function Notice() {
  return (
    <CommonLayout>
      <CustomErrorBoundary element={<Main />} />
    </CommonLayout>
  );
}

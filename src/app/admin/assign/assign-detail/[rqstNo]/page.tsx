import Main from "@components/admin/assign/assign-detail/Main";
import { CustomErrorBoundary } from "@components/error-boundary";
import { CommonLayout } from "@components/layout";
import { AD_ASSIGN_DETAIL_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: AD_ASSIGN_DETAIL_METADATA.TITLE,
  description: AD_ASSIGN_DETAIL_METADATA.DESCRIPTION,
};

export default async function Detail() {
  return (
    <CommonLayout>
      <CustomErrorBoundary element={<Main />} />
    </CommonLayout>
  );
}

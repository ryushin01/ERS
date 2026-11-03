import type { Metadata } from "next";
import { AD_ASSIGN_DETAIL_METADATA } from "@constants/metadata";
import { CommonLayout } from "@components/layout";
import { CustomErrorBoundary } from "@components/error-boundary";
import Main from "@components/admin/assign/assign-detail/Main";

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

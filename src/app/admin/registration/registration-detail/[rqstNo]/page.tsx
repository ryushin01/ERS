import Main from "@components/admin/registration/registration-detail/Main";
import { CustomErrorBoundary } from "@components/error-boundary";
import { CommonLayout } from "@components/layout";
import { AD_REGISTRATION_DETAIL_METADATA } from "@constants/metadata";
import { demoRequestNumbers } from "@/mocks/data";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: AD_REGISTRATION_DETAIL_METADATA.TITLE,
  description: AD_REGISTRATION_DETAIL_METADATA.DESCRIPTION,
};

export function generateStaticParams() {
  return demoRequestNumbers().map((rqstNo) => ({ rqstNo }));
}

export default async function Detail() {
  return (
    <CommonLayout>
      <CustomErrorBoundary element={<Main />} />
    </CommonLayout>
  );
}

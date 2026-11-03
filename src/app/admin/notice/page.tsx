import Main from "@components/admin/notice/Main";
import { CommonLayout } from "@components/layout";
import { AD_NOTICE_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: AD_NOTICE_METADATA.TITLE,
  description: AD_NOTICE_METADATA.DESCRIPTION,
};

export default async function Notice() {
  return (
    <CommonLayout>
      <Main />
    </CommonLayout>
  );
}

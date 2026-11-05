import Main from "@components/admin/member/Main";
import { CommonLayout } from "@components/layout";
import { AD_MEMBER_DETAIL_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: AD_MEMBER_DETAIL_METADATA.TITLE,
  description: AD_MEMBER_DETAIL_METADATA.DESCRIPTION,
};

export default async function Detail() {
  return (
    <CommonLayout>
      <Main />
    </CommonLayout>
  );
}

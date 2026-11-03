import Main from "@components/admin/member/Main";
import { CommonLayout } from "@components/layout";
import { AD_MEMBER_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: AD_MEMBER_METADATA.TITLE,
  description: AD_MEMBER_METADATA.DESCRIPTION,
};

export default async function Member() {
  return (
    <CommonLayout>
      <Main />
    </CommonLayout>
  );
}
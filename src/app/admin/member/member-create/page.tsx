import type { Metadata } from "next";
import { AD_MEMBER_CREATE_METADATA } from "@constants/metadata";
import { CommonLayout } from "@components/layout";

export const metadata: Metadata = {
  title: AD_MEMBER_CREATE_METADATA.TITLE,
  description: AD_MEMBER_CREATE_METADATA.DESCRIPTION,
};

export default async function Create() {
  return (
    <CommonLayout>
      <div>
        회원 등록
      </div>
    </CommonLayout>
  );
}
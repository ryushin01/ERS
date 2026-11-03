"use client";

import { Breadcrumb, Typography } from "@components/common";
import CreateForm from "./CreateForm";

export default function Main() {

  return (
    <section>
      <Breadcrumb />

      <Typography
        as="h2"
        kind="headline-medium"
        isBold={true}
        className="py-6"
      >전자등기 신규등록</Typography>

      <CreateForm />
    </section>
  );
}
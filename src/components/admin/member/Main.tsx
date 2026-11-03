"use client";

import { TemporaryLoading } from "@components/common";

export default function Main() {
  return (
    <section className="_flex-center flex-col gap-y-5 h-[calc(100vh-132px)] pb-8">
      <TemporaryLoading />
    </section>
  );
}

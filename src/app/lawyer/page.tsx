import TemporaryLoading from "@components/common/TemporaryLoading";

/* 법무대리인 화면은 미구현입니다. (로그인 화면에서도 "준비 중" 안내 후 진입하지 않음) */
export default async function Lawyer() {
  return (
    <section className="_flex-center flex-col gap-y-5 min-h-screen px-4 text-center">
      <TemporaryLoading />
    </section>
  );
}

import Image from "next/image";
import { AlertCircleIcon } from "@icons36";
import { Typography } from "@components/common";

export default function Loading() {
  return (
    <>
      <div>
        <Image src={AlertCircleIcon} alt="공지 아이콘" width={80} height={80} />
      </div>
      <div>
        <Typography kind="headline-large">&quot;현재 페이지는 </Typography>
        <Typography kind="headline-large" isBold={true} className="underline">서비스 준비 중</Typography>
        <Typography kind="headline-large">입니다.&quot;</Typography>
      </div>
      <Typography kind="title-large">보다 나은 서비스 제공을 위하여 노력하고 있습니다.</Typography>
    </>
  );
}
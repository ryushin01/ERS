"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@components/button";
import { Typography } from "@components/common";
import { FI_REQUEST } from "@constants/path";
import { useResponsive } from "@hooks";
import { AlertCircleIcon, CheckCircleIcon, FileAttachmentIcon } from "@icons36";

import "@styles/banner.css";

type BannerProps = {
  name: string;
  totalcount: number;
  inprogress: number;
  application: number;
};

/**
 * @name Banner
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @property {string} name         - user 이름을 정의합니다.
 * @property {number} totalcount   - 오늘 실행 건수를 정의합니다.
 * @property {number} inprogress   - 진행중인 건수를 정의합니다.
 * @property {number} application  - 접수완료 건수를 정의합니다.
 */

export default function Banner({ name, totalcount, inprogress, application }: BannerProps) {
  const router = useRouter();
  const { isDesktop } = useResponsive();

  return (
    <section className="_banner-container">
      <div className="_banner-left-content">
        <div className="_banner-text">
          <Typography kind={isDesktop ? "headline-large" : "headline-small"}>
            <b>{name}</b>님,
          </Typography>
          <Typography kind={isDesktop ? "headline-large" : "headline-small"}>
            {" "}
            좋은 하루 보내세요!
          </Typography>
        </div>

        <div className="_banner-button">
          <Button
            size={isDesktop ? "md" : "sm"}
            shape="solid"
            color="main5"
            onClick={() => router.push(FI_REQUEST)}
          >
            전자등기 의뢰하기
          </Button>
        </div>
      </div>
      <div className="_banner-right-content">
        <div
          className={`_todays-counts  after:absolute after:top-0 after:left-0 after:w-full after:h-full after:rounded-2xl after:bg-ers-grayscale-100 after:opacity-10`}
        >
          <div className="_todays-image">
            <Image src={FileAttachmentIcon} width={32} height={32} alt="문서 아이콘" />
          </div>
          <div className="_content-text">
            <Typography kind={isDesktop ? "title-medium" : "title-small"}>
              오늘 실행 건수
            </Typography>
            <Typography kind={isDesktop ? "headline-medium" : "title-large"} isBold={true}>
              {totalcount}
              <Typography kind={isDesktop ? "title-medium" : "title-small"}>건</Typography>
            </Typography>
          </div>
        </div>

        <div
          className={`_each-counts after:absolute after:top-0 after:left-0 after:w-full after:h-full after:rounded-2xl after:bg-ers-grayscale-100 after:opacity-10`}
        >
          <div className="_each-wrapper">
            <div className="_notice-image">
              <Image src={AlertCircleIcon} width={32} height={32} alt="알림 아이콘" />
            </div>
            <div className="_content-text">
              <Typography kind={isDesktop ? "title-medium" : "title-small"}>진행중</Typography>
              <Typography kind={isDesktop ? "headline-medium" : "title-large"} isBold={true}>
                {inprogress}
                <Typography kind={isDesktop ? "title-medium" : "title-small"}>건</Typography>
              </Typography>
            </div>
          </div>
          <div className="_each-wrapper">
            <div className="_check-image">
              <Image src={CheckCircleIcon} width={32} height={32} alt="체크 아이콘" />
            </div>
            <div className="_content-text">
              <Typography kind={isDesktop ? "title-medium" : "title-small"}>접수완료</Typography>
              <Typography kind={isDesktop ? "headline-medium" : "title-large"} isBold={true}>
                {application}
                <Typography kind={isDesktop ? "title-medium" : "title-small"}>건</Typography>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

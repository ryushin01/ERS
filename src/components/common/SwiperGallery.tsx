import { ReactNode } from "react";
import Image from "next/image";
import { Controller, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { LeftArrowIcon, RightArrowIcon } from "@icons24";
import { CancelIcon } from "@icons36";

import Frame from "./Frame";
import Loading from "./Loading";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@styles/responsive-swiper.css";

export type GallerySlide = {
  key: string;
  content: ReactNode;
  /* 지정하면 슬라이드 우측 상단에 개별 삭제 버튼 노출 */
  onDelete?: () => void;
};

type SwiperGalleryProps = {
  slides: GallerySlide[];
  className?: string;
  paginationType?: "fraction" | "progressbar";
  isLoading?: boolean;
};

/**
 * @name SwiperGallery
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 등기자료 이미지 슬라이드 공통 컴포넌트입니다. 부모 컴포넌트가 클라이언트 컴포넌트이어야 합니다.
 *              슬라이드 내용(이미지)은 사용하는 쪽에서 만들어 전달합니다.
 */
export default function SwiperGallery({
                                        slides,
                                        className = "",
                                        paginationType = "fraction",
                                        isLoading = false,
                                      }: SwiperGalleryProps) {
  return (
    <>
      {isLoading && <Loading />}
      <div className="_responsive-swiper-wrapper">
        <Swiper
          className={`_responsive-swiper ${className}`}
          // 사용 모듈 정의
          modules={[Controller, Navigation, Pagination]}
          // swiper-wrapper 태그 정의
          wrapperTag="ul"
          // 한 번에 노출할 슬라이드 개수 정의
          slidesPerView={"auto"}
          // 페이지네이션
          pagination={{ type: paginationType }}
          navigation={{
            prevEl: "._btn-prev",
            nextEl: "._btn-next",
          }}
        >
          {slides.map(({ key, content, onDelete }) => (
            // swiper-slide 태그 정의
            <SwiperSlide tag="li" key={key}>
              <Frame>{content}</Frame>

              {onDelete && (
                <button
                  type="button"
                  className="absolute top-0 right-0 rounded bg-ers-grayscale-0/30"
                  onClick={onDelete}
                >
                  <Image src={CancelIcon} alt="이미지 개별 삭제 아이콘" width={36} height={36} />
                </button>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <button type="button" className="_btn-prev" aria-label="이전 슬라이드 보기">
          <Image src={LeftArrowIcon} alt="좌측 화살표 아이콘" width={24} height={24} />
        </button>
        <button type="button" className="_btn-next" aria-label="다음 슬라이드 보기">
          <Image src={RightArrowIcon} alt="우측 화살표 아이콘" width={24} height={24} />
        </button>
      </div>
    </>
  );
}

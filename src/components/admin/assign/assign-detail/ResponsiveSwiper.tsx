import Image from "next/image";
import { CancelIcon, LeftArrowIcon, RightArrowIcon } from "@icons24";
import { appURI } from "@constants/env";
import { Frame, ImageWithAuth, Loading } from "@components/common";
import { ResponsiveType, SwiperImage } from "@types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Controller, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@styles/responsive-swiper.css";

type ResponsiveSwiperProps = {
  className?: string;
  requestNo?: string;
  imageList?: MergedImage[];
  imageLoading?: boolean;
  isDesktop?: boolean;
  handleFileDelete?: (i: number) => void;
  apiImageLength?: number;
};

type MergedImage = SwiperImage & { source: "api" | "prop" };

/**
 * @name ResponsiveSwiper
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 부모 컴포넌트가 클라이언트 컴포넌트이어야 합니다.
 */
export default function ResponsiveSwiper({
                                           className = "",
                                           requestNo,
                                           imageList = [],
                                           imageLoading,
                                           isDesktop,
                                           handleFileDelete,
                                           apiImageLength,
                                         }: ResponsiveSwiperProps & ResponsiveType) {
  return (
    <>
      {imageLoading && <Loading />}
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
          pagination={{
            type: isDesktop ? "fraction" : "progressbar",
          }}
          navigation={{
            prevEl: "._btn-prev",
            nextEl: "._btn-next",
          }}
        >
          {imageList.map((image: MergedImage, index: number) => {
            const { seq, filIdx, src, attcFilNm, source } = image;

            return (
              <SwiperSlide tag="li" key={`${seq}_${filIdx}_${attcFilNm}`}>
                <Frame>
                  {source === "prop" ? (
                    <Image
                      src={`${src}`}
                      alt={`의뢰번호 ${requestNo}의 등기자료 ${
                        index + 1
                      }번 이미지`}
                      width={isDesktop ? 400 : 250}
                      height={isDesktop ? 600 : 340}
                    />
                  ) : (
                    <ImageWithAuth
                      src={`${appURI}/api${src}`}
                      alt={`의뢰번호 ${requestNo}의 등기자료 ${
                        index + 1
                      }번 이미지`}
                      width={isDesktop ? 400 : 250}
                      height={isDesktop ? 600 : 340}
                    />
                  )}
                </Frame>

                {source === "prop" && (
                  <button
                    type="button"
                    className="absolute top-0 right-0 rounded bg-koser-grayscale-0/30"
                    onClick={() => handleFileDelete?.(index - apiImageLength!)}
                  >
                    <Image
                      src={CancelIcon}
                      alt="이미지 개별 삭제 아이콘"
                      width={36}
                      height={36}
                    />
                  </button>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button
          type="button"
          className="_btn-prev"
          aria-label="이전 슬라이드 보기"
        >
          <Image
            src={LeftArrowIcon}
            alt="좌측 화살표 아이콘"
            width={24}
            height={24}
          />
        </button>
        <button
          type="button"
          className="_btn-next"
          aria-label="다음 슬라이드 보기"
        >
          <Image
            src={RightArrowIcon}
            alt="우측 화살표 아이콘"
            width={24}
            height={24}
          />
        </button>
      </div>
    </>
  );
}

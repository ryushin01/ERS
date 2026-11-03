import Image from "next/image";
import { LeftArrowIcon, RightArrowIcon } from "@icons24";
import { CancelIcon } from "@icons36";
import { Frame } from "@components/common";
import { Swiper, SwiperSlide } from "swiper/react";
import { Controller, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@styles/responsive-swiper.css";

type ImageListProps = {
  imageList: string[];
  handleFileDelete: (i: number) => void;
};

/**
 * @name ResponsiveSwiper
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 부모 컴포넌트가 클라이언트 컴포넌트이어야 합니다.
 *              관리자 화면 중 전자등기 신규등록에서 사용하는 로컬 컴포넌트입니다.
 */
export default function ResponsiveSwiper({
  imageList,
  handleFileDelete,
}: ImageListProps) {
  return (
    <>
      <div className="_responsive-swiper-wrapper">
        <Swiper
          className="_responsive-swiper _admin"
          modules={[Controller, Navigation, Pagination]}
          wrapperTag="ul"
          slidesPerView={"auto"}
          pagination={{
            type: "fraction",
          }}
          navigation={{
            prevEl: "._btn-prev",
            nextEl: "._btn-next",
          }}
        >
          {imageList &&
            imageList?.map((e, i) => {
              return (
                <SwiperSlide tag="li" key={i}>
                  <Frame>
                    <Image src={e} alt={`등기자료 ${i + 1}번 이미지`} fill />
                  </Frame>

                  <button
                    type="button"
                    className="absolute top-0 right-0 rounded bg-koser-grayscale-0/30"
                    onClick={() => handleFileDelete(i)}
                  >
                    <Image
                      src={CancelIcon}
                      alt="이미지 개별 삭제 아이콘"
                      width={36}
                      height={36}
                    />
                  </button>
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

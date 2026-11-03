import { Typography } from "@components/common";
import { useResponsive } from "@hooks";

import "@styles/accordion.css";

/**
 * @name AccordionHeader
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export default function AccordionHeader() {
  const { isDesktop } = useResponsive();

  return (
    <div className={isDesktop ? "_accordion-header" : "_mb-accordion-header"}>
      {isDesktop ? (
        <span className="_accordion-text">
          <span className="_top-titles">
            <Typography kind={"title-medium"} className="_id ">
              번호
            </Typography>
            <Typography kind={"title-medium"} className="_title">
              제목
            </Typography>
          </span>
          <span className="_bottom-titles">
            <Typography kind={"title-medium"} className="_author">
              작성자
            </Typography>
            <Typography kind={"title-medium"} className="_date-text">
              등록일
            </Typography>
          </span>
          <span className="_accordion-toggle-icon">&nbsp;</span>
        </span>
      ) : (
        <></>
      )}
    </div>
  );
}

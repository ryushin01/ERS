import { Typography } from "@components/common";

/**
 * @name DrawerFooter
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export default function DrawerFooter() {
  return (
    <div className="_drawer-footer">
      <Typography kind="body-small" isBold={true}>서비스 이용문의</Typography>
      <a href="tel:0000-0000">
        <Typography kind="title-large" isBold={true} className="text-ers-main-100">0000-0000</Typography>
      </a>
      <Typography kind="caption-large" className="text-ers-grayscale-90">평일 09:00~18:00<br />(토요일, 공휴일
        휴무)</Typography>
    </div>
  );
};

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FI_MENU_LIST, AD_MENU_LIST } from "@constants/menu";
import { Typography } from "@components/common";
import { useResponsive } from "@hooks";

/**
 * @name Gnb
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export default function Gnb() {
  const pathname = usePathname();
  const { isDesktop } = useResponsive();

  return (
    <nav className="_gnb">
      <ul>
        {(pathname.includes("/admin") ? AD_MENU_LIST : FI_MENU_LIST).map((menu) => {
          const { id, name, path, defaultIcon, selectedIcon } = menu;

          return (
            <li
              key={id}
              className={pathname.includes(path) ? "_selected" : undefined}
            >
              <Link href={path}>
                <span className="_menu-item-inner-wrapper">
                  {(defaultIcon && selectedIcon) &&
                    <Image
                      src={isDesktop ?
                        (pathname.includes(path) ? selectedIcon! : defaultIcon!) : (selectedIcon!)}
                      alt={`${name} 메뉴 ${pathname.includes(path) ? "선택" : "선택 해제"}`}
                      width={24}
                      height={24}
                    />
                  }
                  <Typography
                    kind={isDesktop ? "title-medium" : "caption-small"}>
                    {name}
                  </Typography>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
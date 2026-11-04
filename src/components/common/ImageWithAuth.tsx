"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

import { DefaultProfile } from "@common";
import { axiosBasicInstance } from "@services";

interface ImageWithAuthProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: ImageProps["src"];
}

/**
 * @name ImageWithAuth
 * @version 2.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 인증이 필요한 이미지를 표시하기 위한 컴포넌트입니다.
 *              - 공통 axios 인스턴스로 이미지를 요청하므로 토큰은 Authorization 헤더로만 전달됩니다. (URL·프록시 미사용)
 *              - 응답 받은 이미지는 Blob URL로 표시하고, 언마운트 시 해제합니다.
 *              - 요청에 실패하면 기본 이미지(fallbackSrc)를 표시합니다. (데모 모드에서는 목업 어댑터가 이미지를 응답)
 * @property {string} src          - 이미지 url
 * @property {string} fallbackSrc  - 이미지를 불러오지 못했을 때 표시할 이미지 (기본값: 기본 프로필 이미지)
 */
export default function ImageWithAuth({
  src,
  alt,
  fallbackSrc = DefaultProfile,
  ...props
}: ImageWithAuthProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setObjectUrl(null);
      return;
    }

    let createdUrl: string | null = null;
    let isCancelled = false;

    axiosBasicInstance
      .get<Blob>(src, { responseType: "blob" })
      .then((response) => {
        if (isCancelled) return;
        createdUrl = URL.createObjectURL(response.data);
        setObjectUrl(createdUrl);
      })
      .catch(() => {
        if (!isCancelled) setObjectUrl(null);
      });

    return () => {
      isCancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [src]);

  if (!objectUrl) {
    return <Image src={fallbackSrc} alt={alt} {...props} />;
  }

  // Blob URL은 Next.js 이미지 최적화 대상이 아니므로 unoptimized 처리
  return <Image src={objectUrl} alt={alt} unoptimized {...props} />;
}

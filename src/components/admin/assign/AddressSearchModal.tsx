"use client";

import DaumPostcode, { type Address } from "react-daum-postcode";

import { Modal } from "@components/modal";
import { type AddressForm, toAddressFields } from "@utils/addressUtil";

type AddressSearchModalProps = {
  /* 주소를 고르면 지번(roadAddr)·도로명(rdnmAddr) 주소를 넘겨줌. 모달 닫기는 onClose로 처리 */
  onSelect: (address: Pick<AddressForm, "roadAddr" | "rdnmAddr">) => void;
  onClose: () => void;
};

/**
 * @name AddressSearchModal
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 담보목적물 주소검색 모달 (다음·카카오 우편번호 서비스). 전자등기 신규 등록·배정 상세에서 공통으로 사용합니다.
 */
export default function AddressSearchModal({ onSelect, onClose }: AddressSearchModalProps) {
  const handleComplete = (data: Address) => {
    onSelect(toAddressFields(data));
    onClose();
  };

  return (
    <Modal title="주소검색" size="md" onClose={onClose}>
      <DaumPostcode onComplete={handleComplete} />
    </Modal>
  );
}

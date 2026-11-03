import Image from "next/image";
import { Spinner } from "@common";
import "@styles/spinner.css";

export default function Loading() {
  return (
    <div className="_spinner-wrapper">
      <div className="_spinner-backdrop"></div>
      <div className="_spinner-container">
        <Image
          src={Spinner}
          alt="로딩 스피너"
          width={64}
          height={64}
          className="_spinner"
        />
      </div>
    </div>
  );
}

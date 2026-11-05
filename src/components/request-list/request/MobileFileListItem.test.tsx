import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MobileFileListItem from "./MobileFileListItem";

import type { FileProps } from "./MobileFileUploader";

vi.mock("@components/common", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@components/common")>()),
  // 서버 이미지는 인증 요청 없이 자리만 표시
  ImageWithAuth: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));

const serverImage = (filIdx: number): FileProps => ({
  uid: `SEQ_${filIdx}`,
  seq: "SEQ",
  filIdx,
  attcFilNm: `server-${filIdx}.jpeg`,
  src: `/files/${filIdx}`,
});

const newImage = (uid: string): FileProps => ({
  uid,
  attcFilNm: `${uid}.jpeg`,
  src: "data:image/jpeg;base64,AA==",
});

const file = (name: string) => new File(["x"], name, { type: "image/jpeg" });

/** 수정 화면처럼 서버 이미지 + 새로 찍은 이미지가 섞인 목록. 남은 파일 이름을 화면에 표시합니다. */
function Harness({
  initialImages,
  initialFiles,
}: {
  initialImages: FileProps[];
  initialFiles: File[];
}) {
  const [imageList, setImageList] = useState(initialImages);
  const [fileList, setFileList] = useState(initialFiles);
  const [existing, setExisting] = useState(initialImages.filter((image) => image.seq));

  return (
    <>
      <ul data-testid="images">
        <MobileFileListItem
          imageList={imageList}
          setImageList={setImageList}
          fileList={fileList}
          setFileList={setFileList}
          setIsExistingImageList={setExisting}
        />
      </ul>
      <output data-testid="files">{fileList.map((item) => item.name).join(",")}</output>
      <output data-testid="existing">{existing.map((item) => item.attcFilNm).join(",")}</output>
    </>
  );
}

const deleteButtons = () =>
  within(screen.getByTestId("images")).getAllByRole("button", { name: "해당 이미지 삭제" });

describe("MobileFileListItem 이미지 삭제", () => {
  const images = [serverImage(1), serverImage(2), newImage("new-a"), newImage("new-b")];
  const files = () => [file("a.jpeg"), file("b.jpeg")];

  it("새 이미지를 지우면 서버로 보낼 파일에서 그 파일만 빠진다", () => {
    render(<Harness initialImages={images} initialFiles={files()} />);

    fireEvent.click(deleteButtons()[2]); // new-a

    expect(screen.getByTestId("files")).toHaveTextContent(/^b\.jpeg$/);
    expect(screen.getByTestId("existing")).toHaveTextContent("server-1.jpeg,server-2.jpeg");
    expect(deleteButtons()).toHaveLength(3);
  });

  it("서버 이미지를 지워도 새로 찍은 파일은 그대로 남는다", () => {
    render(<Harness initialImages={images} initialFiles={files()} />);

    fireEvent.click(deleteButtons()[0]); // server-1

    expect(screen.getByTestId("files")).toHaveTextContent(/^a\.jpeg,b\.jpeg$/);
    expect(screen.getByTestId("existing")).toHaveTextContent(/^server-2\.jpeg$/);
  });

  it("상태 배열을 직접 바꾸지 않는다", () => {
    const initialFiles = files();
    render(
      <Harness
        initialImages={[newImage("new-a"), newImage("new-b")]}
        initialFiles={initialFiles}
      />,
    );

    fireEvent.click(deleteButtons()[0]);

    expect(initialFiles).toHaveLength(2);
    expect(screen.getByTestId("files")).toHaveTextContent(/^b\.jpeg$/);
  });
});

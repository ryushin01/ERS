import { Typography } from "@components/common";

export default function EmptyBox() {
  return (
    <>
      <div className="_empty-box">
        <Typography kind="body-medium">자료 없음</Typography>
      </div>
    </>
  );
}
import { Typography } from "@components/common";
import { useResponsive } from "@hooks";

type EmptyBoxProps = {
  element: string;
};

export default function EmptyBox({ element }: EmptyBoxProps) {
  const { isDesktop } = useResponsive();

  return (
    <div className="flex _flex-center w-full h-full">
      <Typography kind={isDesktop ? "title-medium" : "body-medium"}>{element}</Typography>
    </div>
  );
}

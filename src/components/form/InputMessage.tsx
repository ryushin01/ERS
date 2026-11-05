import { Typography } from "@components/common";

type InputMessageProps = {
  children: string;
  id?: string;
};

/**
 * @name InputMessage
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export default function InputMessage({ children, id }: InputMessageProps) {
  const textStyle = `_input-message`;
  return (
    <Typography id={id} kind="caption-large" className={textStyle}>
      {children}
    </Typography>
  );
}

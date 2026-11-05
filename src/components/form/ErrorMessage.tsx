import { Typography } from "@components/common";

type ErrorMessageProps = {
  children: string;
  id?: string;
};

/**
 * @name ErrorMessage
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export default function ErrorMessage({ children, id }: ErrorMessageProps) {
  const textStyle = `_input-message _error`;
  return (
    <Typography id={id} kind="caption-large" className={textStyle}>
      {children}
    </Typography>
  );
}

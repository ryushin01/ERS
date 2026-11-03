import { Typography } from "@components/common";

type ErrorMessageProps = {
  children: string;
};

/**
 * @name ErrorMessage
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export default function ErrorMessage({ children }: ErrorMessageProps) {
  const textStyle = `_input-message _error`;
  return (
    <Typography kind="caption-large" className={textStyle}>
      {children}
    </Typography>
  );
}

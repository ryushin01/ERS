import { FallbackProps } from "react-error-boundary";

import { Error } from "@components/error-boundary";

/**
 * @name Fallback
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
const Fallback = ({ resetErrorBoundary }: FallbackProps) => {
  // const status = error.response?.status || "500";

  return (
    <Error onReset={resetErrorBoundary} />
  );
};

export default Fallback;

import { Typography } from "@components/common";
import { ResponsiveType } from "@types";

export default function LoginNotice({ isDesktop }: ResponsiveType) {
  return (
    <div className="_login-notice">
      <Typography kind={isDesktop ? "body-large" : "body-small"}>
        전자등기 관리 시스템 사용 문의
      </Typography>

      <div>
        {/* 포트폴리오용 예시 연락처 */}
        <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
          www.example.com
        </a>
        <Typography kind={isDesktop ? "body-medium" : "caption-large"}>
          Tel. 0000-0000 | Fax. 000-0000-0000
        </Typography>
        <a href="mailto:service@example.com">service@example.com</a>
      </div>
    </div>
  );
}

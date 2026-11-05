import { KeyboardEvent, ReactNode, useId, useState } from "react";

import { Badge, Typography } from "@components/common";
import { ResponsiveType } from "@types";

import "@styles/tab.css";

type TabItem = {
  label: string;
  content: ReactNode;
  count?: number;
};

type TabGroupProps = {
  items: TabItem[];
  defaultTab?: number;
  onTabChange?: (index: number) => void;
};

/**
 * @name TabGroup
 * @version 1.3.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @property {number} defaultTab      - 초기 선택 탭 지정
 * @property {function} onTabChange   - 탭 전환 함수
 */
export default function TabGroup({
  items,
  defaultTab,
  onTabChange,
  isDesktop,
}: TabGroupProps & ResponsiveType) {
  const [activeTab, setActiveTab] = useState(defaultTab || 0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  /* 탭 키보드 이동 (WAI-ARIA 탭 패턴): ←/→로 이전·다음 탭, Home/End로 처음·마지막 탭 */
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = items.length - 1;
    const nextIndex = {
      ArrowRight: index === lastIndex ? 0 : index + 1,
      ArrowLeft: index === 0 ? lastIndex : index - 1,
      Home: 0,
      End: lastIndex,
    }[event.key];

    if (nextIndex === undefined) return;
    event.preventDefault();
    handleTabChange(nextIndex);
    document.getElementById(tabId(nextIndex))?.focus();
  };

  const tabGroupId = useId();
  const tabId = (index: number) => `${tabGroupId}-tab-${index}`;
  const panelId = `${tabGroupId}-panel`;

  return (
    <div className="_tab-container">
      <ul role="tablist" className="_tab-list">
        {items.map((tab, index) => (
          // tablist의 자식은 tab이어야 하므로 li는 목록 의미를 없앰(presentation)
          <li key={index} role="presentation" className="_tab-list-wrap">
            <button
              type="button"
              role="tab"
              id={tabId(index)}
              aria-selected={activeTab === index}
              aria-controls={panelId}
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => handleTabChange(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="_tab-trigger"
            >
              <Typography
                kind={isDesktop ? "title-large" : "body-large"}
                isBold={activeTab === index}
              >
                {tab.label}
              </Typography>

              {tab.count !== undefined && (
                <Badge type="number" colorType={activeTab === index ? "active" : "default"}>
                  {tab.count}
                </Badge>
              )}
            </button>
            <div className={`_tab-border ${activeTab === index ? "active" : ""}`}></div>
          </li>
        ))}
      </ul>
      <div role="tabpanel" id={panelId} aria-labelledby={tabId(activeTab)} className="_tab-content">
        {items[activeTab]?.content}
      </div>
    </div>
  );
}

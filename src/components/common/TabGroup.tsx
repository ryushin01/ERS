import { ReactNode, useState } from "react";

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

  return (
    <div className="_tab-container">
      <ul role="tablist" className="_tab-list">
        {items.map((tab, index) => (
          <li key={index} className="_tab-list-wrap">
            <button
              type="button"
              role="tab"
              onClick={() => handleTabChange(index)}
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
      <div className="_tab-content">{items[activeTab]?.content}</div>
    </div>
  );
}

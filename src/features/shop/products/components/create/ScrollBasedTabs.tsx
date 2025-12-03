"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface ScrollBasedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

export function ScrollBasedTabs({
  tabs,
  activeTab,
  onTabClick,
}: ScrollBasedTabsProps) {
  return (
    <div className="flex space-x-0 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={cn(
            "relative px-6 py-4 text-sm font-medium transition-colors duration-200",
            "hover:text-orange-600 focus:outline-none focus:text-orange-600",
            activeTab === tab.id
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
          )}
        </button>
      ))}
    </div>
  );
}

export default ScrollBasedTabs;

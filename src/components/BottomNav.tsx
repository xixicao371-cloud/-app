/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppTab } from "../types";
import { Home, Wrench, Sparkles, Compass, User } from "lucide-react";

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: "home" as AppTab, label: "首页", icon: Home },
    { id: "tools" as AppTab, label: "便民", icon: Wrench },
    { id: "ai" as AppTab, label: "AI智助", icon: Sparkles },
    { id: "services" as AppTab, label: "服务", icon: Compass },
    { id: "profile" as AppTab, label: "我的", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-[68px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-full transition-colors focus:outline-none group"
              id={`nav-tab-${tab.id}`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#00BFA5] text-white shadow-md shadow-[#00BFA5]/20"
                    : "text-[#718096] group-hover:text-[#00BFA5]"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.25]" />
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                  isActive ? "text-[#00BFA5] font-bold" : "text-[#718096]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AppTab } from "./types";
import BottomNav from "./components/BottomNav";
import HomeTab from "./components/HomeTab";
import ToolsTab from "./components/ToolsTab";
import AiTab from "./components/AiTab";
import ServicesTab from "./components/ServicesTab";
import ProfileTab from "./components/ProfileTab";
import { Sparkles, Compass, User, Wrench, Home } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("home");

  // Secondary sub-tab states for inter-app navigation clicks
  const [toolsSubTab, setToolsSubTab] = useState("express");
  const [servicesSubTab, setServicesSubTab] = useState("recipe");
  const [aiSubTab, setAiSubTab] = useState("qa");

  // Helper title strings
  const getTabTitle = () => {
    switch (activeTab) {
      case "home":
        return "青年生活智库 • 首页";
      case "tools":
        return "极速便民便利工具";
      case "ai":
        return "AI 原生成长管家";
      case "services":
        return "生活常识与求职探索";
      case "profile":
        return "我的资产与记账账本";
      default:
        return "青年生活智助";
    }
  };

  const handleSetToolsSub = (sub: string) => {
    setToolsSubTab(sub);
  };

  const handleSetServicesSub = (sub: string) => {
    setServicesSubTab(sub);
  };

  return (
    <div className="bg-[#F0F5F5] min-h-screen font-sans text-[#2D3748] antialiased flex flex-col selection:bg-[#00BFA5] selection:text-white">
      {/* Top Banner Header (Premium App layout) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 py-3.5 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-[#00BFA5] text-white rounded-xl p-2 shadow-sm flex items-center justify-center leading-none">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-[#1A202C] tracking-tight leading-none">
                青年生活智助
              </h1>
              <p className="text-[10px] text-[#718096] font-medium tracking-wider mt-1">
                YOUTH LIFE SMART ASSISTANT
              </p>
            </div>
          </div>

          <span className="text-[10px] bg-[#E0F2F1] text-[#00796B] font-bold px-3 py-1.5 rounded-full shadow-sm">
            {getTabTitle()}
          </span>
        </div>
      </header>

      {/* Main app physical screen bounds simulation */}
      <main className="flex-1 w-full max-w-md mx-auto bg-transparent min-h-[calc(100vh-68px-64px)] pb-6 relative">
        {activeTab === "home" && (
          <HomeTab
            setActiveTab={setActiveTab}
            setToolsSubTab={handleSetToolsSub}
            setServicesSubTab={handleSetServicesSub}
          />
        )}
        
        {activeTab === "tools" && (
          <ToolsTab initialSubTab={toolsSubTab} />
        )}
        
        {activeTab === "ai" && (
          <AiTab initialSubTab={aiSubTab} />
        )}
        
        {activeTab === "services" && (
          <ServicesTab initialSubTab={servicesSubTab} />
        )}
        
        {activeTab === "profile" && (
          <ProfileTab />
        )}
      </main>

      {/* Bottom Sticky Safe-Area Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

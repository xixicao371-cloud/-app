/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { AppTab, WeatherData, LifeHack } from "../types";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Sparkles,
  BookOpen,
  Coffee,
  Sunset
} from "lucide-react";

interface HomeTabProps {
  setActiveTab: (tab: AppTab) => void;
  setToolsSubTab?: (sub: string) => void;
  setServicesSubTab?: (sub: string) => void;
}

const POPULAR_CITIES = [
  "北京", "上海", "广州", "深圳", 
  "杭州", "成都", "武汉", "西安"
];

const STATIC_LIFE_HACKS: LifeHack[] = [
  {
    id: "hack-1",
    category: "省钱妙招",
    title: "18-35岁终身省钱：开通这些『学生/青年身份卡』",
    summary: "不要以为毕业就没优惠了！支付宝大学生专区、中国铁路12306、各大航空青年特价，看这一篇全掌握。",
    content: "1. 铁路12306：寒暑假可以享受学生优惠乘车，毕业后部分省市提供『青年驿站』免费前3天住宿计划。\n2. 支付宝/微信大学生验证：毕业2-3年内，通过学信网可以在支付宝『学生活动中心』继续享受部分商户7-8折（如海底捞、麦当劳等）。\n3. 视频及云服务商：腾讯云、阿里云等对25岁以下免学生认证直接享受『青年开发者扶持计划』，服务器低至9元/月。"
  },
  {
    id: "hack-2",
    category: "租房避坑",
    title: "深圳/上海毕业生租房：『首月/押金三大防坑条约』",
    summary: "押一付三还是押一付一？水电费民用商用天差地别，签约前务必默念这4条防御指南。",
    content: "1. 水电标准：公寓多为商水商电（水7元/吨，电1.5元/度），民房小区为民水民电（水3-4元，电0.6元）。每个月差额可能高达300-500元！\n2. 押金退还：必须在合同上明确写明：『租期届满，无损坏、无欠费后，房东应于3个工作日内全额无息退还押金』。\n3. 转租条款：一定要有『允许租客转租，不收取转租手续费，原押金转移』的约定，职场新人工作易动，这样能保留退路。\n4. 设备交接表：在入住当天，对马桶、空调、冰箱等进行合影拍照，尤其是墙脚和发霉处，直接微信发房东作为留档，退房时防止赖账。"
  },
  {
    id: "hack-3",
    category: "居家日常",
    title: "单人独居两周速成『快餐调味黄金万能底』",
    summary: "不需要买十几种大料！只需记住这个老饕珍藏口诀，任何蔬菜、豆腐或肉类，10分钟就能做出馆子味道。",
    content: "1. 万能勾芡底（适合炒饭、盖浇饭）：2勺生抽 + 1勺蚝油 + 半勺老抽（上色） + 半勺白糖 + 1勺淀粉 + 5勺清水。\n2. 万能凉拌汁（适合鸡胸肉、黄瓜、面条）：蒜末、葱花、芝麻、辣椒粉淋热油，随后加入3勺香醋 + 2勺生抽 + 半勺糖 + 几滴香油。\n3. 酸甜糖醋比例：1勺酒 + 2勺酱油 + 3勺糖 + 4勺醋 + 5勺清水，闭眼煮排骨、豆腐或里脊肉必胜。"
  }
];

export default function HomeTab({ setActiveTab, setToolsSubTab, setServicesSubTab }: HomeTabProps) {
  const [selectedCity, setSelectedCity] = useState("北京");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning");
  const [aiRec, setAiRec] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [expandedHack, setExpandedHack] = useState<string | null>(null);

  // Set initial time of day based on current hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay("morning");
    else if (hour >= 12 && hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  // Fetch weather on city or mount change
  const fetchWeather = async (city: string) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      console.error("Fetch weather failed", e);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  // Generate intelligent AI advice based on context
  const generateAiRecommendation = async (period: typeof timeOfDay) => {
    setAiLoading(true);
    try {
      const contextPrompt = `作为青年智能管家，请根据时段 [${
        period === "morning" ? "早八通勤/早饭阶段" : period === "afternoon" ? "午间充电/搞钱下午茶" : "晚间自习/治愈复盘"
      }]，结合当前城市 [${selectedCity}]，为18-35岁的年轻人生成一条实用、风趣的生活/健康/通勤/求职贴心贴纸（约100字）。不需要多余修饰语，直接输出排版漂亮的中文短段落。`;

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ sender: "user", text: contextPrompt }],
          scenario: "qa"
        }),
      });
      const data = await res.json();
      setAiRec(data.text);
    } catch (e) {
      console.error("AI recommendation error", e);
      setAiRec("早起别忘喝一杯温水，地铁拥挤时注意看好随身贵重物品。搞钱要紧，健康更贵！");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    generateAiRecommendation(timeOfDay);
  }, [timeOfDay, selectedCity]);

  // Weather Icon mapper
  const getWeatherIcon = (iconCode: string) => {
    const code = parseInt(iconCode);
    if (code === 100) return <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" />;
    if (code >= 101 && code <= 104) return <Cloud className="w-10 h-10 text-teal-400" />;
    if (code >= 300 && code <= 399) return <CloudRain className="w-10 h-10 text-cyan-500 animate-bounce" />;
    if (code >= 400 && code <= 499) return <CloudSnow className="w-10 h-10 text-sky-300" />;
    return <Sun className="w-10 h-10 text-amber-400" />;
  };

  const handleShortcutClick = (tab: AppTab, subTab?: string) => {
    setActiveTab(tab);
    if (subTab) {
      if (tab === "tools" && setToolsSubTab) setToolsSubTab(subTab);
      if (tab === "services" && setServicesSubTab) setServicesSubTab(subTab);
    }
  };

  return (
    <div className="pb-24 px-5 pt-6 max-w-md mx-auto space-y-8">
      {/* City Locator & Weather Card */}
      <div className="bg-[#1A202C] text-white rounded-[32px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
        
        {/* City selection scroll */}
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-white/10 overflow-x-auto scrollbar-none">
          <MapPin className="w-4 h-4 text-[#A0AEC0] flex-shrink-0" />
          <div className="flex items-center space-x-1.5 flex-nowrap pr-2">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? "bg-white text-[#1A202C] shadow-sm"
                    : "bg-white/5 hover:bg-white/10 text-[#E2E8F0]"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {weatherLoading ? (
          <div className="flex items-center justify-center py-6">
            <RefreshCw className="w-6 h-6 animate-spin text-white/50" />
          </div>
        ) : weather ? (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-[#A0AEC0] font-medium tracking-wide">
                {weather.cityName} • 实时天气
              </div>
              <div className="text-5xl font-bold tracking-tighter">
                {weather.temp}°
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#CBD5E0] mt-2">
                <span className="bg-white/10 border border-white/10 px-2 py-1 rounded-lg font-medium">
                  {weather.text}
                </span>
                <span>体感 {weather.feelsLike}°</span>
                <span>湿度 {weather.humidity}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              {getWeatherIcon(weather.icon)}
              <span className="text-[10px] mt-2 text-[#A0AEC0]">{weather.windSpeed}</span>
            </div>
          </div>
        ) : null}

        {/* Forecast toggle view */}
        {weather && weather.forecast && weather.forecast.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center text-xs text-[#E2E8F0]">
            {weather.forecast.slice(0, 3).map((f, i) => (
              <div key={i} className="bg-white/5 rounded-2xl py-2 px-1 border border-white/5">
                <div className="text-[10px] text-[#A0AEC0]">{f.date.includes("-") ? f.date.split("-").slice(1).join("/") : f.date}</div>
                <div className="font-semibold my-1">{f.tempMin}~{f.tempMax}°</div>
                <div className="text-[10px] bg-white/10 rounded-md px-1.5 py-0.5 inline-block truncate max-w-full">
                  {f.textDay}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid Menu Entrance (8 keys) */}
      <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm">
        <h2 className="text-sm font-bold text-[#1A202C] mb-5 flex items-center tracking-tight">
          <TrendingUp className="w-4 h-4 text-[#00BFA5] mr-2" />
          八大精选功能直达
        </h2>
        <div className="grid grid-cols-4 gap-y-6 gap-x-2 text-center">
          <button
            onClick={() => handleShortcutClick("home")}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-[20px] bg-[#F7FAFC] text-[#2D3748] border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:bg-[#1A202C] group-hover:text-white transition-all duration-300">
              <Sun className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#718096] font-medium whitespace-nowrap group-hover:text-[#1A202C] transition-colors">天气预报</span>
          </button>

          <button
            onClick={() => handleShortcutClick("tools", "express")}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-[20px] bg-[#F7FAFC] text-[#2D3748] border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:bg-[#1A202C] group-hover:text-white transition-all duration-300">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#718096] font-medium whitespace-nowrap group-hover:text-[#1A202C] transition-colors">快递查询</span>
          </button>

          <button
            onClick={() => handleShortcutClick("tools", "rate")}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-[20px] bg-[#F7FAFC] text-[#2D3748] border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:bg-[#1A202C] group-hover:text-white transition-all duration-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#718096] font-medium whitespace-nowrap group-hover:text-[#1A202C] transition-colors">汇率换算</span>
          </button>

          <button
            onClick={() => handleShortcutClick("services", "recipe")}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-[20px] bg-[#F7FAFC] text-[#2D3748] border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:bg-[#1A202C] group-hover:text-white transition-all duration-300">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#718096] font-medium whitespace-nowrap group-hover:text-[#1A202C] transition-colors">菜谱大全</span>
          </button>

          <button
            onClick={() => handleShortcutClick("services", "job")}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-[20px] bg-[#F7FAFC] text-[#2D3748] border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:bg-[#1A202C] group-hover:text-white transition-all duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#718096] font-medium whitespace-nowrap group-hover:text-[#1A202C] transition-colors">求职求真</span>
          </button>

          <button
            onClick={() => handleShortcutClick("profile", "billing")}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-[20px] bg-[#F7FAFC] text-[#2D3748] border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:bg-[#1A202C] group-hover:text-white transition-all duration-300">
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#718096] font-medium whitespace-nowrap group-hover:text-[#1A202C] transition-colors">记账本</span>
          </button>

          <button
            onClick={() => handleShortcutClick("ai", "emotion")}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-[20px] bg-[#F7FAFC] text-[#2D3748] border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:bg-[#1A202C] group-hover:text-white transition-all duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#718096] font-medium whitespace-nowrap group-hover:text-[#1A202C] transition-colors">情绪树洞</span>
          </button>

          <button
            onClick={() => handleShortcutClick("services", "hack")}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-[20px] bg-[#F7FAFC] text-[#2D3748] border border-[#E2E8F0] flex items-center justify-center mb-2 group-hover:bg-[#1A202C] group-hover:text-white transition-all duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#718096] font-medium whitespace-nowrap group-hover:text-[#1A202C] transition-colors">生活智库</span>
          </button>
        </div>
      </div>

      {/* AI Smart Recommendation (Time-sensitive) */}
      <div className="bg-[#F7FAFC] rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-10">
          <Sparkles className="w-12 h-12 text-[#2D3748]" />
        </div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-[#1A202C] text-white rounded-xl p-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-[#1A202C] font-bold text-sm tracking-tight">智脑伴侣提醒</span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-full p-1 flex space-x-1 text-xs shadow-sm">
            <button
              onClick={() => setTimeOfDay("morning")}
              className={`px-3 py-1 rounded-full transition font-medium ${
                timeOfDay === "morning" ? "bg-[#1A202C] text-white shadow-sm" : "text-[#718096] hover:bg-[#F7FAFC]"
              }`}
            >
              早
            </button>
            <button
              onClick={() => setTimeOfDay("afternoon")}
              className={`px-3 py-1 rounded-full transition font-medium ${
                timeOfDay === "afternoon" ? "bg-[#1A202C] text-white shadow-sm" : "text-[#718096] hover:bg-[#F7FAFC]"
              }`}
            >
              中
            </button>
            <button
              onClick={() => setTimeOfDay("evening")}
              className={`px-3 py-1 rounded-full transition font-medium ${
                timeOfDay === "evening" ? "bg-[#1A202C] text-white shadow-sm" : "text-[#718096] hover:bg-[#F7FAFC]"
              }`}
            >
              晚
            </button>
          </div>
        </div>

        <div className="text-[#2D3748] text-sm leading-relaxed min-h-[50px] relative z-10">
          {aiLoading ? (
            <div className="flex items-center space-x-2 py-3">
              <RefreshCw className="w-4 h-4 animate-spin text-[#A0AEC0]" />
              <span className="text-xs text-[#A0AEC0]">青年管家思考中...</span>
            </div>
          ) : (
            <p className="font-medium text-[#2D3748] bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
              {aiRec || "早起一杯水，迎接元气满满的一天！"}
            </p>
          )}
        </div>
      </div>

      {/* Life Hacks Flow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-[#1A202C] flex items-center tracking-tight">
            <BookOpen className="w-4 h-4 text-[#00BFA5] mr-2" />
            全网生活成长百科
          </h3>
          <button
            onClick={() => handleShortcutClick("services", "hack")}
            className="text-xs text-[#00BFA5] font-semibold flex items-center hover:opacity-80 transition-opacity focus:outline-none"
          >
            更多智库 <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="space-y-3">
          {STATIC_LIFE_HACKS.map((hack) => {
            const isExpanded = expandedHack === hack.id;
            return (
              <div
                key={hack.id}
                onClick={() => setExpandedHack(isExpanded ? null : hack.id)}
                className="bg-white rounded-3xl p-5 border border-[#E2E8F0] hover:border-[#CBD5E0] transition-all cursor-pointer shadow-sm group focus:outline-none"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-[#F7FAFC] border border-[#E2E8F0] text-[#4A5568] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                    {hack.category}
                  </span>
                  <span className="text-[10px] text-[#A0AEC0] font-medium group-hover:text-[#718096] transition-colors">{isExpanded ? "收起" : "点击展开"}</span>
                </div>
                <h4 className="text-sm font-bold text-[#1A202C] group-hover:text-[#00BFA5] transition-colors leading-tight">
                  {hack.title}
                </h4>
                <p className="text-xs text-[#718096] mt-2 line-clamp-2 leading-relaxed">
                  {hack.summary}
                </p>
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] text-xs text-[#4A5568] leading-relaxed space-y-2 whitespace-pre-wrap">
                    {hack.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

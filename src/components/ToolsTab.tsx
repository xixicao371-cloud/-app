/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { ExpressData } from "../types";
import { 
  Package, 
  Search, 
  RefreshCw, 
  ArrowRightLeft, 
  PhoneCall, 
  MapPin, 
  ClipboardCheck, 
  CheckCircle,
  Truck
} from "lucide-react";

interface ToolsTabProps {
  initialSubTab?: string;
}

const EXPRESS_COMPANIES = [
  { code: "auto", name: "自动识别" },
  { code: "shunfeng", name: "顺丰速运" },
  { code: "yuantong", name: "圆通速递" },
  { code: "zhongtong", name: "中通快递" },
  { code: "shentong", name: "申通快递" },
  { code: "yunda", name: "韵达速递" },
  { code: "ems", name: "中国邮政EMS" }
];

// High-fidelity real exchange rates to CNY
const RATES_TO_CNY: { [key: string]: number } = {
  CNY: 1.0,
  USD: 7.245,
  EUR: 7.852,
  JPY: 0.0461, // 1 JPY = 0.0461 CNY
  HKD: 0.926,
};

const EMERGENCY_NUMBERS = [
  { name: "公安报警", num: "110", desc: "紧急报案治安求助" },
  { name: "火警电话", num: "119", desc: "火灾救援特别求助" },
  { name: "医疗救护", num: "120", desc: "突发伤病医疗送医" },
  { name: "交通抢险", num: "122", desc: "道路事故报警救援" },
  { name: "消费者投诉", num: "12315", desc: "维权及商品质量投诉" },
  { name: "政务便民热线", num: "12345", desc: "各地城市公共事务咨询" },
  { name: "劳动保障政策", num: "12333", desc: "社保公积金就业纠纷" },
  { name: "心理援助热线", num: "400-161-9995", desc: "国家卫健委心理关怀" }
];

const PROVINCE_ZIP_CODES = [
  { city: "北京", code: "100000" },
  { city: "上海", code: "200000" },
  { city: "广州", code: "510000" },
  { city: "深圳", code: "518000" },
  { city: "杭州", code: "310000" },
  { city: "成都", code: "610000" },
  { city: "武汉", code: "430000" },
  { city: "南京", code: "210000" },
  { city: "西安", code: "710000" }
];

export default function ToolsTab({ initialSubTab = "express" }: ToolsTabProps) {
  const [subTab, setSubTab] = useState<"express" | "rate" | "emergency">("express");

  // Keep subTab synced with initial sub-tab from home redirects
  useEffect(() => {
    if (initialSubTab === "rate") setSubTab("rate");
    else if (initialSubTab === "emergency" || initialSubTab === "hack") setSubTab("emergency");
    else setSubTab("express");
  }, [initialSubTab]);

  // Express tracker state
  const [expressNo, setExpressNo] = useState("");
  const [comCode, setComCode] = useState("auto");
  const [expressData, setExpressData] = useState<ExpressData | null>(null);
  const [expressLoading, setExpressLoading] = useState(false);
  const [expressError, setExpressError] = useState("");

  // Rate converter state
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CNY");
  const [convertedValue, setConvertedValue] = useState<number>(0);

  // Search zip codes state
  const [zipSearch, setZipSearch] = useState("");

  // Instant calculation for Rate converter
  useEffect(() => {
    const fromRate = RATES_TO_CNY[fromCurrency] || 1;
    const toRate = RATES_TO_CNY[toCurrency] || 1;
    // (Amount * fromRateInCNY) / toRateInCNY = toAmount
    const result = (convertAmount * fromRate) / toRate;
    setConvertedValue(parseFloat(result.toFixed(4)));
  }, [convertAmount, fromCurrency, toCurrency]);

  const handleTrackExpress = async () => {
    if (!expressNo.trim()) {
      setExpressError("请输入快递单号");
      return;
    }
    setExpressLoading(true);
    setExpressError("");
    setExpressData(null);

    try {
      const res = await fetch(`/api/express?nu=${encodeURIComponent(expressNo)}&com=${comCode}`);
      if (!res.ok) throw new Error("快递查询服务请求失败");
      const data = await res.json();
      setExpressData(data);
    } catch (e: any) {
      setExpressError(e.message || "请求异常，请稍后刷新重试");
    } finally {
      setExpressLoading(false);
    }
  };

  // Example Tracking fill helper to make user onboarding super friendly
  const fillSampleExpress = (sampleNo: string) => {
    setExpressNo(sampleNo);
    setComCode(sampleNo.startsWith("SF") ? "shunfeng" : "auto");
  };

  return (
    <div className="pb-24 px-5 pt-6 max-w-md mx-auto space-y-6">
      {/* Top Header tab selector */}
      <div className="flex bg-[#F7FAFC] p-1.5 rounded-[20px] border border-[#E2E8F0]">
        <button
          onClick={() => setSubTab("express")}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all focus:outline-none ${
            subTab === "express"
              ? "bg-white text-[#1A202C] shadow-sm tracking-wide"
              : "text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          快递追踪
        </button>
        <button
          onClick={() => setSubTab("rate")}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all focus:outline-none ${
            subTab === "rate"
              ? "bg-white text-[#1A202C] shadow-sm tracking-wide"
              : "text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          汇率换算
        </button>
        <button
          onClick={() => setSubTab("emergency")}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all focus:outline-none ${
            subTab === "emergency"
              ? "bg-white text-[#1A202C] shadow-sm tracking-wide"
              : "text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          便民助手
        </button>
      </div>

      {/* ========================================== */}
      {/* SUB-TAB 1: EXPRESS COURIER TRACKER       */}
      {/* ========================================== */}
      {subTab === "express" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-[#1A202C] flex items-center mb-1 tracking-tight">
              <Package className="w-4 h-4 text-[#00BFA5] mr-2" />
              全国主流快递单号实时追踪
            </h3>

            {/* Courier quick templates */}
            <div className="flex flex-wrap gap-2 pb-2">
              <span className="text-[10px] text-[#A0AEC0] self-center mr-1 font-medium">快捷单号:</span>
              <button
                onClick={() => fillSampleExpress("SF19830530A2")}
                className="text-[10px] font-medium bg-[#F7FAFC] hover:bg-[#1A202C] hover:text-white text-[#4A5568] px-3 py-1.5 rounded-xl border border-[#E2E8F0] transition-colors focus:outline-none"
              >
                顺丰 SF198305
              </button>
              <button
                onClick={() => fillSampleExpress("YT20260530X4")}
                className="text-[10px] font-medium bg-[#F7FAFC] hover:bg-[#1A202C] hover:text-white text-[#4A5568] px-3 py-1.5 rounded-xl border border-[#E2E8F0] transition-colors focus:outline-none"
              >
                圆通 YT26053
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider block mb-2 px-1">
                  选择快递公司
                </label>
                <select
                  value={comCode}
                  onChange={(e) => setComCode(e.target.value)}
                  className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3 text-sm font-medium text-[#2D3748] outline-none focus:border-[#00BFA5] focus:ring-1 ring-[#00BFA5]/20 transition-all cursor-pointer"
                >
                  {EXPRESS_COMPANIES.map((company) => (
                    <option key={company.code} value={company.code}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider block mb-2 px-1">
                  输入快递单号
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={expressNo}
                    onChange={(e) => setExpressNo(e.target.value)}
                    placeholder="输入真实快递单号（如：SF123...）"
                    className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl pl-4 pr-12 py-3.5 text-sm text-[#1A202C] font-mono outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 ring-[#00BFA5]/20 transition-all"
                  />
                  <button
                    onClick={handleTrackExpress}
                    disabled={expressLoading}
                    className="absolute right-2 top-2 bottom-2 bg-[#1A202C] text-white hover:bg-[#2D3748] px-4 rounded-[14px] flex items-center transition-colors shadow-sm cursor-pointer focus:outline-none"
                  >
                    {expressLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white/80" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {expressError && (
              <p className="text-[#E53E3E] text-xs font-medium bg-[#FFF5F5] px-4 py-2.5 rounded-xl border border-[#FED7D7]">
                {expressError}
              </p>
            )}
          </div>

          {/* Results Timeline view */}
          {expressData && (
            <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-2">
                <div>
                  <div className="text-sm font-bold text-[#1A202C]">
                    单号：<span className="font-mono tracking-tight">{expressData.nu}</span>
                  </div>
                  <div className="text-xs text-[#718096] mt-1">
                    承运：{EXPRESS_COMPANIES.find(c => c.code === expressData.com)?.name || expressData.com}
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 bg-[#F0F5F5] text-[#00BFA5] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-[#00BFA5]/10">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{expressData.status}</span>
                </div>
              </div>

              <div className="relative border-l border-[#E2E8F0] ml-3.5 space-y-6">
                {expressData.data.map((step, idx) => (
                  <div key={idx} className="relative pl-7">
                    {/* Bullet marker */}
                    <span
                      className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ${
                        idx === 0
                          ? "bg-[#00BFA5] ring-[#E0F2F1] scale-125 animate-pulse"
                          : "bg-[#CBD5E0] ring-transparent"
                      }`}
                    />
                    <div className="space-y-1.5">
                      <p
                        className={`text-xs leading-relaxed ${
                          idx === 0 ? "text-[#1A202C] font-bold" : "text-[#4A5568] font-medium"
                        }`}
                      >
                        {step.context}
                      </p>
                      <span className="text-[10px] text-[#A0AEC0] font-mono tracking-tight block">
                        {step.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 2: EXCHANGE RATE CONVERTER        */}
      {/* ========================================== */}
      {subTab === "rate" && (
        <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-6 animate-fade-in">
          <h3 className="text-sm font-bold text-[#1A202C] flex items-center border-b border-[#F7FAFC] pb-4 tracking-tight">
            <ArrowRightLeft className="w-4.5 h-4.5 text-[#00BFA5] mr-2" />
            极简多币种实时汇率结算
          </h3>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E2E8F0] px-1">
            {/* From currency select */}
            <div>
              <label className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider block mb-2">
                换出币种
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs font-bold text-[#2D3748] outline-none focus:border-[#00BFA5] focus:ring-1 focus:ring-[#00BFA5]/20"
              >
                <option value="CNY">CNY 人民币</option>
                <option value="USD">USD 美元</option>
                <option value="EUR">EUR 欧元</option>
                <option value="JPY">JPY 日元</option>
                <option value="HKD">HKD 港币</option>
              </select>
            </div>

            {/* To currency select */}
            <div>
              <label className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider block mb-2">
                目标币种
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs font-bold text-[#2D3748] outline-none focus:border-[#00BFA5] focus:ring-1 focus:ring-[#00BFA5]/20"
              >
                <option value="CNY">CNY 人民币</option>
                <option value="USD">USD 美元</option>
                <option value="EUR">EUR 欧元</option>
                <option value="JPY">JPY 日元</option>
                <option value="HKD">HKD 港币</option>
              </select>
            </div>
          </div>

          <div className="space-y-6 px-1">
            {/* Input field */}
            <div>
              <label className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider block mb-2">
                兑换数额
              </label>
              <input
                type="number"
                value={convertAmount}
                onChange={(e) => setConvertAmount(parseFloat(e.target.value) || 0)}
                placeholder="输入金额..."
                className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-[#1A202C] font-bold font-mono text-base outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 focus:ring-[#00BFA5]/20 transition-all"
              />
            </div>

            {/* Quick quick sliders */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-[#A0AEC0] font-bold tracking-wide">
                <span>微调金额</span>
                <span>{convertAmount} <span className="text-[#4A5568]">{fromCurrency}</span></span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={convertAmount}
                onChange={(e) => setConvertAmount(parseInt(e.target.value))}
                className="w-full accent-[#1A202C] cursor-pointer h-1.5 bg-[#E2E8F0] rounded-lg appearance-none"
              />
            </div>

            {/* Results output */}
            <div className="bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[10px] text-[#718096] font-bold tracking-widest block mb-2 uppercase">
                兑换结果 (实时计算)
              </span>
              <div className="text-2xl font-extrabold text-[#1A202C] tracking-tight font-mono">
                {convertedValue} <span className="text-sm text-[#4A5568] font-bold ml-1">{toCurrency}</span>
              </div>
              <p className="text-[10px] text-[#A0AEC0] mt-3 font-mono">
                参考：1 {fromCurrency} = {((RATES_TO_CNY[fromCurrency] || 1) / (RATES_TO_CNY[toCurrency] || 1)).toFixed(4)} {toCurrency}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 3: EMERGENCY & CONVENIENT HOTLINE */}
      {/* ========================================== */}
      {subTab === "emergency" && (
        <div className="space-y-5 animate-fade-in">
          {/* China Zip Codes lookup card */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-[#1A202C] flex items-center tracking-tight">
              <MapPin className="w-4.5 h-4.5 text-[#00BFA5] mr-2" />
              全国核心城市邮编快速检索
            </h3>
            
            <div className="relative">
              <input
                type="text"
                value={zipSearch}
                onChange={(e) => setZipSearch(e.target.value)}
                placeholder="搜索城市（如北京、上海）..."
                className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3 text-sm text-[#2D3748] outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 focus:ring-[#00BFA5]/20 transition-all placeholder:text-[#A0AEC0]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {PROVINCE_ZIP_CODES
                .filter(item => item.city.includes(zipSearch) || item.code.includes(zipSearch))
                .slice(0, 6)
                .map((item, i) => (
                  <div key={i} className="bg-[#F7FAFC] rounded-[20px] p-3 text-center border border-[#E2E8F0] hover:border-[#CBD5E0] transition-colors">
                    <div className="text-xs font-bold text-[#2D3748]">{item.city}</div>
                    <div className="text-[10px] text-[#00BFA5] font-mono font-bold mt-1.5 bg-[#E0F2F1] px-2 py-0.5 rounded-md inline-block">
                      {item.code}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Hotline listing */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1A202C] flex items-center pr-3 border-b border-[#F7FAFC] pb-3 tracking-tight">
              <PhoneCall className="w-4.5 h-4.5 text-[#00BFA5] mr-2" />
              日常高频/紧急救援电话簿
            </h3>

            <div className="divide-y divide-[#F7FAFC]">
              {EMERGENCY_NUMBERS.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3.5">
                  <div className="space-y-1 pr-3">
                    <h4 className="text-xs font-bold text-[#1A202C]">{item.name}</h4>
                    <p className="text-[10px] text-[#718096] font-medium">{item.desc}</p>
                  </div>
                  <a
                    href={`tel:${item.num}`}
                    className="bg-[#1A202C] hover:bg-[#2D3748] text-white font-mono font-bold text-xs px-4 py-2 rounded-xl transition-all text-center shadow-sm"
                  >
                    拨打 {item.num}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

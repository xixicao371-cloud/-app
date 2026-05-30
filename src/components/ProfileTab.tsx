/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Transaction, UserSettings } from "../types";
import {
  User,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Wallet,
  Settings,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronRight
} from "lucide-react";

const PRESET_CATEGORIES = ["餐饮外卖", "房租房贷", "通勤出行", "学习提升", "休闲娱乐", "其他杂务"];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "tx-1", type: "expense", amount: 28, category: "餐饮外卖", date: "2026-05-28", remark: "午饭麻辣烫" },
  { id: "tx-2", type: "expense", amount: 1500, category: "房租房贷", date: "2026-05-01", remark: "交房租" },
  { id: "tx-3", type: "expense", amount: 6, category: "通勤出行", date: "2026-05-28", remark: "坐地铁" },
  { id: "tx-4", type: "expense", amount: 19, category: "学习提升", date: "2026-05-29", remark: "买程序员秘籍" },
  { id: "tx-5", type: "income", amount: 3500, category: "其他杂务", date: "2026-05-25", remark: "发放兼职报酬" }
];

export default function ProfileTab() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const persisted = localStorage.getItem("youth_bookkeeping_txs");
      if (persisted) return JSON.parse(persisted);
    } catch (e) {}
    return INITIAL_TRANSACTIONS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const persisted = localStorage.getItem("youth_user_settings");
      if (persisted) return JSON.parse(persisted);
    } catch (e) {}
    return {
      userName: "体验官同学",
      budgetMonthly: 3000,
      theme: "light",
      notifications: true,
    };
  });

  // Entry states
  const [txType, setTxType] = useState<"expense" | "income">("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState("餐饮外卖");
  const [txRemark, setTxRemark] = useState("");
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split("T")[0]);

  // UI Toast notifications
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 2500);
  };

  useEffect(() => {
    localStorage.setItem("youth_bookkeeping_txs", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("youth_user_settings", JSON.stringify(settings));
  }, [settings]);

  // Insert ledger record
  const handleAddTransaction = () => {
    const amt = parseFloat(txAmount);
    if (!amt || amt <= 0) {
      showToast("输入的账单金额需要大于 0 哦");
      return;
    }

    const newTx: Transaction = {
      id: `tx-user-${Date.now()}`,
      type: txType,
      amount: amt,
      category: txCategory,
      remark: txRemark.trim() || `${txCategory}活动`,
      date: txDate,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setTxAmount("");
    setTxRemark("");
    showToast("账单已成功入账！");
  };

  // Remove ledger record
  const handleRemoveTx = (id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
    showToast("已成功抽离并删除了该笔账单。");
  };

  // Calculate statistics
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, current) => sum + current.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, current) => sum + current.amount, 0);

  // Category wise statistics for Donut chart
  const categoryStats = PRESET_CATEGORIES.map((cat) => {
    const sum = transactions
      .filter((t) => t.type === "expense" && t.category === cat)
      .reduce((s, curr) => s + curr.amount, 0);
    return { name: cat, value: sum };
  }).filter((item) => item.value > 0);

  const totalCategorySum = categoryStats.reduce((s, c) => s + c.value, 0);

  // Settings handles
  const handleClearData = () => {
    if (confirm("确定要恢复出厂设置吗？这将丢弃全部记账本和聊天等本地持久状态。")) {
      localStorage.clear();
      setTransactions(INITIAL_TRANSACTIONS);
      setSettings({
        userName: "体验官同学",
        budgetMonthly: 3000,
        theme: "light",
        notifications: true,
      });
      showToast("应用已成功重置，复归初始状态！");
    }
  };

  // SVG color palette definitions
  const CATEGORY_COLORS = ["#14b8a6", "#22d3ee", "#eab308", "#f43f5e", "#a855f7", "#64748b"];

  return (
    <div className="pb-24 px-5 pt-6 max-w-md mx-auto space-y-6">
      {/* Dynamic Alert Popups */}
      {toastMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#1A202C] text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-[#00BFA5]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* User Info Card */}
      <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F7FAFC] text-[#1A202C] flex items-center justify-center font-bold text-xl shadow-sm border border-[#E2E8F0]">
            {settings.userName.substring(0, 2)}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#1A202C] flex items-center tracking-tight">
              {settings.userName}
              <ShieldCheck className="w-4 h-4 ml-2 text-[#00BFA5]" />
            </h3>
            <p className="text-[10px] text-[#4A5568] font-bold bg-[#F7FAFC] border border-[#E2E8F0] px-3 py-1 rounded-md inline-block">
              等级：青年智助体验官
            </p>
          </div>
        </div>
        
        <Settings className="w-5 h-5 text-[#A0AEC0] cursor-pointer hover:text-[#1A202C] transition-colors focus:outline-none" onClick={() => showToast("您已是高级合规用户。")} />
      </div>

      {/* Bookkeeping statistics card */}
      <div className="bg-[#1A202C] text-white rounded-[32px] p-6 shadow-sm space-y-5">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="space-y-1.5">
            <span className="text-[10px] text-[#A0AEC0] font-bold tracking-widest uppercase block">
              本月预算利用进度指标
            </span>
            <div className="text-2xl font-bold tracking-tight">
              {totalExpense} <span className="text-xs text-[#718096] font-bold font-mono">/ {settings.budgetMonthly} 元</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#A0AEC0] block tracking-wide">预算空闲</span>
            <span className="text-base font-bold font-mono text-[#00BFA5]">
              {Math.max(0, settings.budgetMonthly - totalExpense)} 元
            </span>
          </div>
        </div>

        {/* Budget bar slider */}
        <div className="space-y-2">
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                totalExpense > settings.budgetMonthly ? "bg-[#E53E3E]" : "bg-[#00BFA5]"
              }`}
              style={{ width: `${Math.min(100, (totalExpense / settings.budgetMonthly) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#E2E8F0] font-bold tracking-wide">
            <span>百分比：{((totalExpense / settings.budgetMonthly) * 100).toFixed(1)}%</span>
            <span>{totalExpense > settings.budgetMonthly ? "⚠️ 您已超支了，注意缩紧开支！" : "预算充裕"}</span>
          </div>
        </div>

        {/* Financial aggregate breakdown indicators */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3 border border-white/10">
            <span className="bg-[#E53E3E] text-white rounded-xl p-2 shadow-sm">
              <TrendingDown className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[9px] text-[#A0AEC0] block tracking-wide">本月账单支出</span>
              <span className="text-sm font-bold font-mono">{totalExpense} 元</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3 border border-white/10">
            <span className="bg-[#00BFA5] text-white rounded-xl p-2 shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[9px] text-[#A0AEC0] block tracking-wide">本月外围收入</span>
              <span className="text-sm font-bold font-mono">{totalIncome} 元</span>
            </div>
          </div>
        </div>
      </div>

      {/* LEDGER LOGGER ENTRY FORM */}
      <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-[#1A202C] flex items-center mb-2 tracking-tight">
          <Wallet className="w-4.5 h-4.5 text-[#00BFA5] mr-2" />
          手动记账速写面板
        </h3>

        <div className="space-y-4">
          {/* Income vs Expense select */}
          <div className="flex bg-[#F7FAFC] p-1 rounded-2xl border border-[#E2E8F0]">
            <button
              onClick={() => {
                setTxType("expense");
                setTxCategory("餐饮外卖");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                txType === "expense" ? "bg-white text-[#E53E3E] shadow-sm" : "text-[#718096]"
              }`}
            >
              账单支出
            </button>
            <button
              onClick={() => {
                setTxType("income");
                setTxCategory("其他杂务");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                txType === "income" ? "bg-white text-[#00BFA5] shadow-sm" : "text-[#718096]"
              }`}
            >
              外围收入
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#A0AEC0] block mb-2 uppercase tracking-wide">
                选择分类
              </label>
              <select
                value={txCategory}
                onChange={(e) => setTxCategory(e.target.value)}
                className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl px-3 py-2.5 text-sm font-bold text-[#1A202C] outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 focus:ring-[#00BFA5]/20 transition-all cursor-pointer appearance-none"
              >
                {txType === "expense" ? (
                  PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="兼职副业">兼职副业</option>
                    <option value="工资薪水">工资薪水</option>
                    <option value="奖学生活费">奖学生活费</option>
                    <option value="其他杂务">其他杂务</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#A0AEC0] block mb-2 uppercase tracking-wide">
                消费金额 (元)
              </label>
              <input
                type="number"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl px-3 py-2.5 text-sm font-bold font-mono text-[#1A202C] outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 focus:ring-[#00BFA5]/20 transition-all placeholder:text-[#A0AEC0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#A0AEC0] block mb-2 uppercase tracking-wide">
                备注细节
              </label>
              <input
                type="text"
                value={txRemark}
                onChange={(e) => setTxRemark(e.target.value)}
                placeholder="备注如: 麦当劳"
                className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl px-3 py-2.5 text-sm text-[#1A202C] outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 focus:ring-[#00BFA5]/20 transition-all placeholder:text-[#A0AEC0]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#A0AEC0] block mb-2 uppercase tracking-wide">
                记账日期
              </label>
              <input
                type="date"
                value={txDate}
                onChange={(e) => setTxDate(e.target.value)}
                className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl px-3 py-2.5 text-sm font-bold text-[#1A202C] outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 focus:ring-[#00BFA5]/20 transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleAddTransaction}
            className="w-full bg-[#1A202C] hover:bg-[#2D3748] text-white font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition transform hover:scale-101 shadow-sm cursor-pointer focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            <span>记入一笔</span>
          </button>
        </div>
      </div>

      {/* REVOLUTIONARY DETAILED CATEGORY DONUT CHART */}
      {categoryStats.length > 0 && (
        <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-4">
          <h4 className="text-[10px] font-bold text-[#A0AEC0] tracking-widest uppercase mb-2">
            📊 消费细分比例
          </h4>

          {/* Fully custom responsive SVG circle layout */}
          <div className="flex items-center justify-around py-4">
            <svg width="120" height="120" viewBox="0 0 120 120" className="rotate-[-90deg]">
              {/* Build composite circle segments */}
              {(() => {
                let accumulatedPercent = 0;
                return categoryStats.map((stat, i) => {
                  const percent = stat.value / totalCategorySum;
                  const strokeDasharray = `${percent * 282.6} 282.6`;
                  const strokeDashoffset = `-${accumulatedPercent * 282.6}`;
                  accumulatedPercent += percent;
                  return (
                    <circle
                      key={i}
                      cx="60"
                      cy="60"
                      r="45"
                      fill="transparent"
                      stroke={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                      strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 hover:stroke-[#1A202C] cursor-pointer"
                    />
                  );
                });
              })()}
              <circle cx="60" cy="60" r="29" fill="white" />
            </svg>

            {/* Legends list */}
            <div className="space-y-2.5 text-xs font-bold text-[#4A5568]">
              {categoryStats.map((stat, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full block flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="truncate max-w-[80px]">{stat.name}:</span>
                  <span className="font-mono text-[#1A202C]">
                    {((stat.value / totalCategorySum) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RECORD LEDGER HISTORY STREAM */}
      <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3 mb-2">
          <span className="text-sm font-bold text-[#1A202C] tracking-tight">账单流水 ({transactions.length})</span>
          <span className="text-[10px] text-[#A0AEC0] uppercase tracking-wide">滑动查看细节</span>
        </div>

        <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2 divide-y divide-[#F7FAFC] scrollbar-thin">
          {transactions.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${item.type === "expense" ? "bg-[#E53E3E]" : "bg-[#00BFA5]"}`} />
                  <span className="font-bold text-[#1A202C] tracking-tight">{item.remark}</span>
                </div>
                <div className="text-[10px] text-[#A0AEC0] font-mono font-medium pl-4">
                  {item.date} • {item.category}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`font-mono font-bold text-sm ${item.type === "expense" ? "text-[#E53E3E]" : "text-[#00BFA5]"}`}>
                  {item.type === "expense" ? "-" : "+"} {item.amount}
                </span>
                <button
                  onClick={() => handleRemoveTx(item.id)}
                  className="text-[#A0AEC0] hover:text-[#E53E3E] cursor-pointer p-1.5 rounded-lg hover:bg-[#FFF5F5] transition-colors focus:outline-none"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APP PREFERENCES AND THEME INFO */}
      <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-5">
        <h4 className="text-xs font-bold text-[#1A202C] border-b border-[#E2E8F0] pb-3 tracking-wide">
          ⚙️ 系统配置及本地清理
        </h4>

        <div className="space-y-4">
          {/* Custom Settings username fields */}
          <div className="flex justify-between items-center py-1 text-xs">
            <span className="text-[#4A5568] font-bold">配置我的称呼</span>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => setSettings({ ...settings, userName: e.target.value })}
              className="bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-right text-xs font-bold text-[#1A202C] outline-none focus:border-[#00BFA5] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex justify-between items-center py-1 text-xs">
            <span className="text-[#4A5568] font-bold font-sans">我的每月消费预算 (元)</span>
            <input
              type="number"
              value={settings.budgetMonthly}
              onChange={(e) => setSettings({ ...settings, budgetMonthly: parseInt(e.target.value) || 0 })}
              className="bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-right text-xs font-bold font-mono text-[#1A202C] outline-none focus:border-[#00BFA5] focus:bg-white w-28 transition-colors"
            />
          </div>

          <div className="flex justify-between items-center py-1 text-xs">
            <span className="text-[#4A5568] font-bold">主题色彩偏好</span>
            <span className="text-[#1A202C] font-bold border border-[#E2E8F0] px-3 py-1 bg-[#F7FAFC] rounded-lg tracking-wide text-[10px]">
               极简主题 (默认)
            </span>
          </div>

          <button
            onClick={handleClearData}
            className="w-full text-center text-[10px] font-bold text-[#A0AEC0] hover:text-[#E53E3E] py-3 mt-2 rounded-[14px] border border-dashed border-[#CBD5E0] hover:border-[#FC8181] hover:bg-[#FFF5F5] transition duration-200 cursor-pointer uppercase tracking-widest select-none focus:outline-none"
          >
            清除本地缓存并重置智助
          </button>
        </div>
      </div>
    </div>
  );
}

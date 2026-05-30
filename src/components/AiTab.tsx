/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { 
  Sparkles, 
  Send, 
  Trash2, 
  ClipboardCopy, 
  Smile, 
  Heart, 
  Frown, 
  Copy, 
  CheckCircle,
  HelpCircle,
  BrainCircuit,
  Compass,
  RefreshCw
} from "lucide-react";

interface AiTabProps {
  initialSubTab?: string;
}

const PRELOADED_QUESTIONS = [
  "刚毕业租房，房东强制押一付三合理吗？要怎么拒绝？",
  "大学生/刚工作买云服务器、看视频怎么搞最省钱？",
  "简历里写『熟悉Python和协作』太单调，怎么包装得高级点？",
  "刚入职不知道怎么写周报/日报，能帮我写个通用高情商模板吗？"
];

const EMOTION_SLIDER_LABELS = [
  { val: 0, icon: "🥵", text: "焦虑崩溃", color: "from-rose-400 to-orange-400" },
  { val: 1, icon: "😴", text: "极其疲惫", color: "from-amber-400 to-orange-300" },
  { val: 2, icon: "😐", text: "处于紧绷", color: "from-cyan-400 to-sky-450" },
  { val: 3, icon: "😸", text: "开心知足", color: "from-teal-400 to-emerald-400" },
];

const COPY_TEMPLATES = [
  {
    id: "rent",
    title: "高情商退租金/砍价模板",
    prompt: "帮我拟写一份高情商的朋友圈砍价/给房东发消息的模板，表达我想续签但预算有限，希望下季度少100，同时表示我会保持房子十分干净整洁。",
  },
  {
    id: "resume",
    title: "应届生/职场新人简历字句美化",
    prompt: "我只主导和参与过学校里的一个课程微信小程序开发，怎么包装美化成一段精悍专业的简历工作亮点？",
  },
  {
    id: "interview",
    title: "高薪面试黄金突围回复",
    prompt: "面试官问我：『你之前的项目经历并不完全对口我们这个岗位，你觉得你的核心优势是什么？』帮我生成一段高情商抗压说辞。",
  },
  {
    id: "weekly",
    title: "极简救急办公周报润色",
    prompt: "本周我做的工作有：跟进了解后台数据，整理了3个bug报告，和UI沟通改了界面。请以专业的、富有逻辑的方式帮我组织成一篇精彩周报汇报。",
  }
];

export default function AiTab({ initialSubTab = "qa" }: AiTabProps) {
  const [subTab, setSubTab] = useState<"qa" | "emotion" | "copywriter">("qa");

  useEffect(() => {
    if (initialSubTab === "emotion") setSubTab("emotion");
    else if (initialSubTab === "copywriter") setSubTab("copywriter");
    else setSubTab("qa");
  }, [initialSubTab]);

  // Chat QA session state
  const [qaMessages, setQaMessages] = useState<ChatMessage[]>(() => {
    try {
      const persisted = localStorage.getItem("youth_qa_history");
      if (persisted) return JSON.parse(persisted);
    } catch (e) {}
    return [
      {
        id: "wel-1",
        sender: "assistant",
        text: "哈喽！我是你的青年生活智助 AI 管家。无论是刚毕业租房签合同的水电疑虑、职场求职简历字句的润色包装，还是下班后的省钱做饭指南，我全都能帮你见招拆招！快来提问吧：",
        timestamp: new Date().toLocaleTimeString("zh-CN", { hour12: false })
      }
    ];
  });
  const [qaInput, setQaInput] = useState("");
  const [qaLoading, setQaLoading] = useState(false);

  // Tree Hole Psychology state
  const [stressLevel, setStressLevel] = useState(1); // Default to extremely tired
  const [feelingsText, setFeelingsText] = useState("");
  const [holeResponse, setHoleResponse] = useState("");
  const [holeLoading, setHoleLoading] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingText, setBreathingText] = useState("准备开始");

  // Copywriter helper state
  const [copyOutput, setCopyOutput] = useState("");
  const [copyLoading, setCopyLoading] = useState(false);
  const [customCopyPrompt, setCustomCopyPrompt] = useState("");

  // Toast status notification state (elegant replacement of window.alert)
  const [toastText, setToastText] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("youth_qa_history", JSON.stringify(qaMessages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [qaMessages]);

  const triggerToast = (text: string) => {
    setToastText(text);
    setTimeout(() => {
      setToastText("");
    }, 2500);
  };

  // 1-click copy handler
  const handleCopyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    triggerToast("已成功复制到剪纸簿！");
  };

  // AI QA request
  const handleSendQa = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `m-user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("zh-CN", { hour12: false })
    };

    setQaMessages((prev) => [...prev, userMsg]);
    setQaInput("");
    setQaLoading(true);

    try {
      const updatedHistory = [...qaMessages, userMsg];
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory,
          scenario: "qa"
        }),
      });

      if (!res.ok) throw new Error("AI 对话调用失败");
      const data = await res.json();

      setQaMessages((prev) => [
        ...prev,
        {
          id: `m-ai-${Date.now()}`,
          sender: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString("zh-CN", { hour12: false })
        }
      ]);
    } catch (e: any) {
      setQaMessages((prev) => [
        ...prev,
        {
          id: `m-ai-err-${Date.now()}`,
          sender: "assistant",
          text: `出错了：${e.message || "请求异常，请检查配置，随后再次提问。"}`,
          timestamp: new Date().toLocaleTimeString("zh-CN", { hour12: false })
        }
      ]);
    } finally {
      setQaLoading(false);
    }
  };

  const handleClearHistory = () => {
    setQaMessages([
      {
        id: `wel-new-${Date.now()}`,
        sender: "assistant",
        text: "对话记录已清除，我们开始新的聊天吧！",
        timestamp: new Date().toLocaleTimeString("zh-CN", { hour12: false })
      }
    ]);
  };

  // Tree Hole Psychology Submission
  const handleTunnelSubmit = async () => {
    if (!feelingsText.trim()) {
      triggerToast("请至少写一个字，让树洞倾听你呀");
      return;
    }
    setHoleLoading(true);
    setHoleResponse("");

    const moodLabel = EMOTION_SLIDER_LABELS.find(l => l.val === stressLevel);
    const combinedPrompt = `我现在的心情指数是：[${moodLabel?.icon} ${moodLabel?.text}]。我很想对心理树洞说出我的真心话：『${feelingsText}』。请给予温暖舒缓的安慰，并为我提供2-3条治愈建议及一句话舒压口诀。`;

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ sender: "user", text: combinedPrompt }],
          scenario: "emotion"
        }),
      });
      const data = await res.json();
      setHoleResponse(data.text);
    } catch (e) {
      setHoleResponse("今天辛苦了吧。人在疲倦的时候，所有坏情绪都有权利跳出来。这不是你的错哦，现在试着把手机放下，去喝一杯热热的牛奶，或者干脆钻进被窝里大睡一觉。明天太阳照常升起！");
    } finally {
      setHoleLoading(false);
    }
  };

  // Breathing Loop Guide
  const runBreathingExercise = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setBreathingText("准备开始");
      return;
    }

    setIsBreathing(true);
    let counter = 0;
    const stages = [
      { text: "🌟 吸气中... (腹部慢慢隆起)", duration: 4 },
      { text: "🌬️ 屏息中... (静心放松全身)", duration: 4 },
      { text: "✨ 呼气中... (放空所有焦虑)", duration: 6 }
    ];

    let currentStageIdx = 0;
    setBreathingText(stages[0].text);

    const interval = setInterval(() => {
      counter++;
      if (counter >= stages[currentStageIdx].duration) {
        counter = 0;
        currentStageIdx = (currentStageIdx + 1) % stages.length;
        setBreathingText(stages[currentStageIdx].text);
      }
    }, 1000);

    // Keep dynamic cleanup handle
    (window as any).breathingInterval = interval;
  };

  useEffect(() => {
    return () => {
      if ((window as any).breathingInterval) {
        clearInterval((window as any).breathingInterval);
      }
    };
  }, []);

  // Copywriter logic
  const handleGenerateCopy = async (promptText: string) => {
    setCopyLoading(true);
    setCopyOutput("");
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ sender: "user", text: promptText }],
          scenario: "copywriter"
        }),
      });
      const data = await res.json();
      setCopyOutput(data.text);
    } catch (e) {
      setCopyOutput("【复制助手提示：出错了。这是一个高价值的万金油通用沟通模板】:\n\n'房东您好，我是住在XX租户房门XX的。过去半年来承蒙您的照顾。因为公司最近做业务岗位统筹，我的预算面临极大优化缩减。咱们房子我也喜欢也保持得干净利落。不知在接下来续租时，看在诚意和干净的份上，是否能稍微给予200的小降幅？期待您的答复！'");
    } finally {
      setCopyLoading(false);
    }
  };

  return (
    <div className="pb-24 px-5 pt-6 max-w-md mx-auto space-y-6">
      {/* Toast Alert Box */}
      {toastText && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#1A202C] text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-[#00BFA5]" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Segment tabs */}
      <div className="flex bg-[#F7FAFC] p-1.5 rounded-[20px] border border-[#E2E8F0]">
        <button
          onClick={() => setSubTab("qa")}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all focus:outline-none ${
            subTab === "qa"
              ? "bg-white text-[#1A202C] shadow-sm tracking-wide"
              : "text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          全能百科Q&A
        </button>
        <button
          onClick={() => setSubTab("emotion")}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all focus:outline-none ${
            subTab === "emotion"
              ? "bg-white text-[#1A202C] shadow-sm tracking-wide"
              : "text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          情绪树洞
        </button>
        <button
          onClick={() => setSubTab("copywriter")}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all focus:outline-none ${
            subTab === "copywriter"
              ? "bg-white text-[#1A202C] shadow-sm tracking-wide"
              : "text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          高情商文案
        </button>
      </div>

      {/* ========================================== */}
      {/* SUB-TAB 1: ALL ENOMPASSING COGNITIVE CHATBOX */}
      {/* ========================================== */}
      {subTab === "qa" && (
        <div className="space-y-5 animate-fade-in flex flex-col min-h-[60vh]">
          {/* Preloaded quick issues */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-4">
            <span className="text-[10px] text-[#A0AEC0] font-bold block mb-2 tracking-widest uppercase">
              💡 高频热词快速提问
            </span>
            <div className="space-y-2">
              {PRELOADED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQa(q)}
                  className="w-full text-left bg-[#F7FAFC] hover:bg-[#1A202C] hover:text-white border border-[#E2E8F0] rounded-2xl px-4 py-3 text-xs text-[#4A5568] font-medium transition-colors line-clamp-1 truncate focus:outline-none"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Dialog list container */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm flex-1 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center pb-4 border-b border-[#F7FAFC] mb-4">
              <span className="text-sm font-bold text-[#1A202C] flex items-center tracking-tight">
                <BrainCircuit className="w-4 h-4 text-[#00BFA5] mr-2" />
                智脑随身交互史
              </span>
              <button
                onClick={handleClearHistory}
                className="text-[10px] text-[#A0AEC0] hover:text-[#E53E3E] font-bold flex items-center focus:outline-none transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                清空记录
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto max-h-[350px] space-y-5 pr-2 scrollbar-thin">
              {qaMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <span className="text-[9px] text-[#A0AEC0] mb-1 font-mono tracking-widest">
                    {msg.sender === "user" ? "你" : "青年智助"} • {msg.timestamp}
                  </span>
                  <div
                    className={`p-4 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#1A202C] text-white font-medium rounded-2xl rounded-tr-none shadow-sm"
                        : "bg-[#F7FAFC] text-[#2D3748] rounded-2xl rounded-tl-none border border-[#E2E8F0] whitespace-pre-wrap shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {qaLoading && (
                <div className="flex items-center space-x-2 text-[#A0AEC0] text-xs py-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00BFA5]" />
                  <span>管家在翻阅全网知识库，请稍候...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input field */}
            <div className="mt-5 pt-4 border-t border-[#F7FAFC] flex items-center space-x-3">
              <input
                type="text"
                value={qaInput}
                onChange={(e) => setQaInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQa(qaInput)}
                placeholder="发送给管家您的困惑..."
                className="flex-1 bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-sm text-[#1A202C] outline-none focus:bg-white focus:border-[#00BFA5] transition-all"
              />
              <button
                onClick={() => handleSendQa(qaInput)}
                disabled={qaLoading}
                className="bg-[#1A202C] hover:bg-[#2D3748] disabled:bg-[#E2E8F0] text-white rounded-[14px] p-3.5 shadow-sm transition transform hover:scale-105 focus:outline-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 2: EMOTIONAL WELLBEING TREE-HOLE  */}
      {/* ========================================== */}
      {subTab === "emotion" && (
        <div className="space-y-6 animate-fade-in">
          {/* Emotion Gauge Selector */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-[#1A202C] flex items-center tracking-tight">
              <Heart className="w-4.5 h-4.5 text-[#00BFA5] mr-2" />
              第一步：选择您的指标
            </h3>

            {/* Interactive Grid */}
            <div className="flex justify-between items-center py-4 relative">
              <div className="absolute left-0 right-0 h-1.5 bg-[#E2E8F0] rounded-full -z-0" />
              <div
                className="absolute h-1.5 bg-[#1A202C] rounded-full -z-0 transition-all duration-300"
                style={{ width: `${(stressLevel / 3) * 100}%` }}
              />

              {EMOTION_SLIDER_LABELS.map((item) => (
                <button
                  key={item.val}
                  onClick={() => setStressLevel(item.val)}
                  className={`relative flex flex-col items-center z-10 p-1 rounded-2xl transition focus:outline-none ${
                    stressLevel === item.val
                      ? "scale-110 font-bold"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <span className="text-2xl bg-white rounded-full p-2 shadow-sm border border-[#E2E8F0] leading-none">
                    {item.icon}
                  </span>
                  <span
                    className={`text-[9px] mt-2 bg-white px-2.5 py-1 rounded-full border tracking-wide ${
                      stressLevel === item.val ? "text-[#1A202C] border-[#1A202C] font-bold shadow-sm" : "text-[#A0AEC0] border-[#E2E8F0]"
                    }`}
                  >
                    {item.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Narrative text field */}
            <div className="space-y-3 mt-5">
              <label className="text-[10px] font-bold text-[#A0AEC0] uppercase block tracking-wider">
                把今天受过的委屈、累，诉说出来：
              </label>
              <textarea
                value={feelingsText}
                onChange={(e) => setFeelingsText(e.target.value)}
                placeholder="例如：刚入职被拉去做了各种琐碎的事..."
                rows={4}
                className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-sm text-[#2D3748] outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 focus:ring-[#00BFA5]/20 transition-all leading-relaxed"
              />
              <button
                onClick={handleTunnelSubmit}
                disabled={holeLoading}
                className="w-full bg-[#1A202C] hover:bg-[#2D3748] text-white font-bold text-xs py-3.5 rounded-xl shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:bg-[#E2E8F0] transition focus:outline-none"
              >
                {holeLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>温和分析心灵，舒压倾听</span>
              </button>
            </div>
          </div>

          {/* AI Comfort therapist output */}
          {holeResponse && (
            <div className="bg-[#F7FAFC] rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-[#1A202C] text-white rounded-xl p-1.5 shadow-sm">
                  <Heart className="w-3.5 h-3.5" />
                </span>
                <span className="text-[#1A202C] font-bold text-sm tracking-tight">树洞的温暖回复</span>
              </div>
              <p className="text-sm text-[#4A5568] leading-relaxed whitespace-pre-wrap bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                {holeResponse}
              </p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleCopyToClipboard(holeResponse)}
                  className="text-[10px] text-[#4A5568] hover:text-[#1A202C] font-bold flex items-center bg-[#F7FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
                >
                  <ClipboardCopy className="w-3.5 h-3.5 mr-1" />
                  保存安慰
                </button>
              </div>
            </div>
          )}

          {/* Interactive Breathing & Meditation Card */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm relative overflow-hidden text-center">
            <h4 className="text-xs font-bold text-[#1A202C] tracking-widest uppercase mb-2">
              🧘 青年3分钟正念舒缓：呼吸气泡
            </h4>
            <p className="text-[10px] text-[#A0AEC0] max-w-xs mx-auto mb-6">
              让呼吸慢下来，降低心率，平息在都市人潮中紧绷的身心。
            </p>

            <div className="relative py-10 flex justify-center items-center">
              {/* Outer wave visual */}
              <div
                className={`absolute w-32 h-32 rounded-full border border-[#00BFA5]/20 transition-all duration-[3000ms] ${
                  isBreathing ? "scale-150 opacity-20 blur-md" : "scale-100 opacity-0"
                }`}
              />
              {/* Core Breathing Sphere */}
              <div
                className={`w-24 h-24 rounded-full bg-[#E0F2F1] flex items-center justify-center shadow-lg transition-all duration-[4000ms] ease-in-out ${
                  isBreathing ? "scale-125 shadow-[#00BFA5]/20" : "scale-100"
                }`}
              >
                <Heart className="w-10 h-10 text-[#00BFA5] select-none animate-pulse" />
              </div>
            </div>

            <div className="text-xs font-bold my-5 text-[#2D3748] min-h-[20px] tracking-wide">
              {breathingText}
            </div>

            <button
              onClick={runBreathingExercise}
              className={`px-6 py-2.5 rounded-full text-xs font-bold select-none transition-all focus:outline-none ${
                isBreathing
                  ? "bg-[#FFF5F5] text-[#E53E3E] border border-[#FED7D7]"
                  : "bg-[#1A202C] hover:bg-[#2D3748] text-white shadow-sm"
              }`}
            >
              {isBreathing ? "停止训练" : "开始吐纳循环"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 3: COPYWRITER TEMPLATES CREATIVE  */}
      {/* ========================================== */}
      {subTab === "copywriter" && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick options select */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-4">
            <span className="text-[10px] text-[#A0AEC0] font-bold block mb-2 uppercase tracking-widest">
              🎯 选择分类精选模板套用
            </span>
            <div className="grid grid-cols-2 gap-3">
              {COPY_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setCustomCopyPrompt(tpl.prompt);
                    handleGenerateCopy(tpl.prompt);
                  }}
                  className="bg-[#F7FAFC] hover:bg-[#1A202C] hover:text-white text-left p-3.5 rounded-2xl border border-[#E2E8F0] text-xs text-[#2D3748] font-bold tracking-tight transition-colors cursor-pointer focus:outline-none"
                >
                  <div className="line-clamp-2 leading-relaxed">{tpl.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom copy form */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-4">
            <label className="text-[10px] font-bold text-[#A0AEC0] uppercase block mb-2 tracking-widest">
              需要精修美化的自定义文案描述：
            </label>
            <textarea
              value={customCopyPrompt}
              onChange={(e) => setCustomCopyPrompt(e.target.value)}
              placeholder="我想写一篇租到很好租客、但准备降租求稳的微降租朋友圈..."
              rows={4}
              className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-sm text-[#2D3748] outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 focus:ring-[#00BFA5]/20 transition-all leading-relaxed"
            />
            <button
              onClick={() => handleGenerateCopy(customCopyPrompt)}
              disabled={copyLoading || !customCopyPrompt.trim()}
              className="w-full bg-[#1A202C] hover:bg-[#2D3748] disabled:bg-[#E2E8F0] text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition transform hover:scale-101 cursor-pointer focus:outline-none"
            >
              {copyLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>一键极简自动润色</span>
            </button>
          </div>

          {/* Finished Copy display */}
          {copyOutput && (
            <div className="bg-[#F7FAFC] rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-2">
                <span className="text-[#1A202C] font-bold text-xs flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#00BFA5] mr-2" />
                  已为您生成的极简话术
                </span>
                <button
                  onClick={() => handleCopyToClipboard(copyOutput)}
                  className="text-[10px] bg-white border border-[#E2E8F0] hover:bg-[#E2E8F0] text-[#1A202C] font-bold px-3 py-1.5 rounded-lg flex items-center transition-colors focus:outline-none"
                >
                  <ClipboardCopy className="w-3.5 h-3.5 mr-1" />
                  一键复制
                </button>
              </div>
              <p className="text-sm text-[#4A5568] font-medium whitespace-pre-wrap leading-relaxed bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                {copyOutput}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Recipe, JobTrend, LifeHack } from "../types";
import { 
  Utensils, 
  Search, 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  X, 
  HelpCircle, 
  TrendingUp, 
  Clock, 
  Zap,
  DollarSign,
  RefreshCw
} from "lucide-react";

interface ServicesTabProps {
  initialSubTab?: string;
}

const STATIC_RECIPES: Recipe[] = [
  {
    id: "rec-1",
    title: "10分钟神级极简番茄炒蛋",
    imgUrl: "🍳",
    tags: ["家常菜", "快手菜"],
    difficulty: "简单",
    cookingTime: "10分钟",
    ingredients: ["番茄（熟透）2个", "鸡蛋 3个", "小葱 2根", "白糖 1勺", "生抽 半勺", "食用油 适量"],
    steps: [
      "番茄切块，小葱切碎，鸡蛋磕入大碗并用力打散至有细密气泡，加半茶匙盐搅拌。",
      "热锅下稍多一点油，大火烧至冒微烟，倒入蛋液，用筷子快速打圈划散，凝固结块后立即盛出，保持鲜嫩。",
      "锅底留底油，下葱白爆香，倒入番茄碎大火炒出浓郁沙汁（可用锅铲轻压番茄）。",
      "加入一勺白糖中和酸味，淋入半勺生抽，倒入炒好的鸡蛋碎快速翻炒，撒上葱花即可出锅。"
    ],
    description: "拌饭神器，汤汁浓厚甜咸适中，红黄搭配治愈每一个打工人的饥饿肚子。"
  },
  {
    id: "rec-2",
    title: "减脂低卡柠檬手撕鸡胸肉",
    imgUrl: "🥗",
    tags: ["减脂餐", "快手菜"],
    difficulty: "中等",
    cookingTime: "15分钟",
    ingredients: ["鸡胸肉 1块", "柠檬 半个", "黄瓜 半根", "小米辣 2只", "大蒜 4瓣", "香菜 1撮", "酱油 2勺", "醋 2勺"],
    steps: [
      "鸡胸肉冷水下锅，加一勺料酒、几片姜片和葱段，中大火煮12分钟熟透后捞出，放入冰水中浸凉。",
      "顺着纹路把鸡胸肉手撕成细细的丝状，黄瓜切丝，柠檬切薄片并去掉柠檬籽（防发苦）。",
      "调料汁：蒜末、小米辣碎加入两勺生抽、两勺陈醋、半勺香油、少许白糖调成香醋汁。",
      "将手撕鸡丝、黄瓜丝、香菜、调料汁和柠檬片在大碗中里用力抓拌均匀即可食用。"
    ],
    description: "饱腹感拉满，极其清新酸辣开胃，是35岁以下年轻毕业生减脂抗炎的首选。"
  },
  {
    id: "rec-3",
    title: "微波炉版黄金软糯滑蛋芝士牛饭",
    imgUrl: "🍚",
    tags: ["快手菜", "家常菜"],
    difficulty: "简单",
    cookingTime: "8分钟",
    ingredients: ["熟米饭 1碗", "肥牛卷 6片", "鸡蛋 1个", "马苏里拉芝士碎 适量", "洋葱 1/4个", "生抽 1勺", "白糖 半勺"],
    steps: [
      "洋葱切成薄丝，与肥牛卷放入微波炉专属深盘中，淋上一勺生抽和半勺红糖、少许水抓匀。",
      "盖上微波防护盖或扎好透气孔的保鲜膜，中高火微波2.5分钟至肥牛熟透。",
      "装一碗香喷喷热熟米饭，浇上洋葱肥牛碎汁，随后磕入一个打匀状态的蛋液，撒满芝士碎。",
      "再次放入微波炉中高火微波1.5分钟至芝士融化拉丝、蛋液处于嫩黄浆糊状，撒芝麻即享用。"
    ],
    description: "无火烹饪，适合租房无油烟单间。日式烧肉质咸美，拉丝拉满青年幸福指数。"
  },
  {
    id: "rec-4",
    title: "香烤焦糖金黄香蕉燕麦塔",
    imgUrl: "🍌",
    tags: ["甜品", "减脂餐"],
    difficulty: "简单",
    cookingTime: "20分钟",
    ingredients: ["熟香蕉 1根", "即食燕麦片 60g", "牛奶 30ml", "酸奶/坚果 适量", "椰丝/蜂蜜 适量"],
    steps: [
      "熟香蕉半根用叉子在深碗中用力压成细腻的香蕉熟泥。",
      "加入即食燕麦片和牛奶用力搅拌混合，使燕麦完全湿润，团捏成有黏性的小面团。",
      "将软糯面团塞入纸杯或小模具里，用手指按压四周紧实，整出中央凹陷的空塔托壳造型。",
      "烤箱/空气炸锅180度快烤12分钟硬化成型。出炉退温后，在塔托窝里塞入1勺酸奶和半熟浆坚果切片点缀即可。"
    ],
    description: "高膳食纤维，无多余白糖，是周六慵懒早晨补充碳水与植物脂能的艺术品。"
  }
];

const STATIC_JOBS_DATA: JobTrend[] = [
  {
    title: "智能AI研发与系统调优岗",
    salaryRange: "15,000 - 32,000 元",
    demandGrowth: "+148% (年度飞速爆发)",
    hotKeywords: ["模型微调", "RAG架构", "Prompt工程", "API中台"],
    recommendationRating: 5
  },
  {
    title: "跨境及私域流量运营管培",
    salaryRange: "8,000 - 18,000 元",
    demandGrowth: "+85% (稳健大刚需岗位)",
    hotKeywords: ["独立站管理", "高转化文案", "复购促成", "短视频策划"],
    recommendationRating: 4
  },
  {
    title: "新能源/储能系统工程技术员",
    salaryRange: "10,000 - 22,000 元",
    demandGrowth: "+110% (国家骨干方向)",
    hotKeywords: ["电池管理系统", "电气调试", "现场交付", "储能安全控制"],
    recommendationRating: 5
  },
  {
    title: "低空经济与无人驾驶运控指挥",
    salaryRange: "9,000 - 17,000 元",
    demandGrowth: "+210% (新型前沿未来岗)",
    hotKeywords: ["空域调度", "特种设备巡检", "无人机测绘", "航线控制"],
    recommendationRating: 4
  }
];

const MORE_LIFE_HACKS: LifeHack[] = [
  {
    id: "mh-1",
    category: "省钱妙招",
    title: "青年生存法则：怎么用最少钱，塞满每周的冰箱？",
    summary: "去菜市场买菜有什么话术？各大生鲜平台怎样抢免费打平小葱？一文解密菜场里的潜规则。",
    content: "1. 下班19:30后的大型商超清仓：此时钱大妈、盒马、大润发冷鲜肉和熟食会开启『买一送一』、5折骨折打折，去一次省30块。\n2. 去老式菜市场：不要问『怎么卖』，直接指着菜说『老板，要一个番茄和一扎青菜，帮我称一下』。最后撒娇要一根小葱，基本零成本送给你。\n3. 外卖拼单团购群：微信搜索周边写字楼的外卖福利红包社群，每日领2-5元红包，叠用省下一半餐费。"
  },
  {
    id: "mh-2",
    category: "应急科普",
    title: "在外租房突发故障应急知识：漏水、断电、天然气异常",
    summary: "深夜电闸跳空？隔壁马桶溢水？先别急着花高价叫师傅，这3招帮你止损万金。",
    content: "1. 发现大漏水：第一件事不是舀水！是立刻找到厕所马桶后侧，或者入户大门隔壁管道井的主阀门阀，顺时针方向用力拧死关闭总闸，止水后联系房东。\n2. 突然断电跳闸：检查是全楼停电还是唯独自己。自己跳闸的话打开门口集线盒，看看是否是其中一个空气开关（短路或过载）倒向下方。关掉刚才开的大功率电器，用木筷子往上拨回开关即可。\n3. 煤气味泄漏：绝不能开电灯或点火！立即开启全部窗户，随后下楼到空旷地带，拨打燃气供求服务电话报修。在屋内打电话可能有微弱电火花危险！"
  },
  {
    id: "mh-3",
    category: "求职升职",
    title: "毕业生试用期第一课：保护自己劳动权益这4条底线",
    summary: "试用期不交社保合理吗？怎么防范不合理的加班？别等被动裁员了才后悔没看这条指南。",
    content: "1. 试用期必须交社保：《劳动合同法》明确规定，试用期包含在劳动合同期限内，用人单位必须为您依法缴纳社保。如果不给缴，可以直接留底工资条和考勤记录，毕业一年内向劳动监察部门举报百分百退还补缴。\n2. 试用期间工资标准：不能低于正式工作合同内工资的80%，且不得低于和用人单位所在地的最低工资红线。\n3. 离职通知期变动：试用期内离职仅需『提前3天』书面微信发HR即可离去，正式期需提前30天。方便年轻人快速掉头找到更好的方向。"
  }
];

export default function ServicesTab({ initialSubTab = "recipe" }: ServicesTabProps) {
  const [subTab, setSubTab] = useState<"recipe" | "job" | "hack">("recipe");

  useEffect(() => {
    if (initialSubTab === "job") setSubTab("job");
    else if (initialSubTab === "hack") setSubTab("hack");
    else setSubTab("recipe");
  }, [initialSubTab]);

  // Recipe tab states
  const [recipeFilter, setRecipeFilter] = useState("全部");
  const [recipeQuery, setRecipeQuery] = useState("");
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null);
  
  // Custom AI dish scheme generated dynamic state
  const [aiDishLoading, setAiDishLoading] = useState(false);
  const [aiDishResult, setAiDishResult] = useState("");

  // Jobs statistics state
  const [selectedJob, setSelectedJob] = useState<JobTrend | null>(STATIC_JOBS_DATA[0]);

  const filteredRecipes = STATIC_RECIPES.filter((r) => {
    const matchesTag = recipeFilter === "全部" || r.tags.includes(recipeFilter);
    const matchesSearch =
      r.title.includes(recipeQuery) ||
      r.ingredients.some((ing) => ing.toLowerCase().includes(recipeQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  // AI Meal custom planner via Gemini API
  const handleAiMealPlanner = async () => {
    if (!recipeQuery.trim()) {
      alert("请输入你想使用的食材（例如 鸡蛋,西红柿），再点击AI定制方案。");
      return;
    }
    setAiDishLoading(true);
    setAiDishResult("");

    const myPrompt = `我现在冰箱里还剩下和买多的食材：[${recipeQuery}]。请结合18-35岁年轻人极简、快节奏的生活方式，为我构思并定制1款新颖好吃的创意饭菜。输出必须包括『饭名』、『材料清单』以及极其傻瓜好上手的『快炒步骤(3步以内)』。`;

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ sender: "user", text: myPrompt }],
          scenario: "qa"
        }),
      });
      const data = await res.json();
      setAiDishResult(data.text);
    } catch (e) {
      setAiDishResult("【管家速配】香烤葱香蒜蓉豆腐拌：\n• 配料：您的剩余食材 + 2勺酱油 + 1勺香芝麻油\n• 步骤：冰箱食材豆腐洗净放盘，撒蒜茸和酱油，用微波炉大火加热3分钟，取出撒上小葱，淋上烧开的热热麻油即成，极其鲜美饱满。");
    } finally {
      setAiDishLoading(false);
    }
  };

  return (
    <div className="pb-24 px-5 pt-6 max-w-md mx-auto space-y-8">
      {/* Tab Switcher */}
      <div className="flex bg-[#F7FAFC] p-1.5 rounded-[20px] border border-[#E2E8F0]">
        <button
          onClick={() => setSubTab("recipe")}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all focus:outline-none ${
            subTab === "recipe"
              ? "bg-white text-[#1A202C] shadow-sm tracking-wide"
              : "text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          美食菜谱
        </button>
        <button
          onClick={() => setSubTab("job")}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all focus:outline-none ${
            subTab === "job"
              ? "bg-white text-[#1A202C] shadow-sm tracking-wide"
              : "text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          求职资讯
        </button>
        <button
          onClick={() => setSubTab("hack")}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all focus:outline-none ${
            subTab === "hack"
              ? "bg-white text-[#1A202C] shadow-sm tracking-wide"
              : "text-[#718096] hover:text-[#1A202C]"
          }`}
        >
          省钱智库
        </button>
      </div>

      {/* ========================================== */}
      {/* SUB-TAB 1: LUNCH & DINNER RECIPES FINDER  */}
      {/* ========================================== */}
      {subTab === "recipe" && (
        <div className="space-y-6 animate-fade-in">
          {/* Ingredient search / AI matches */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1A202C] flex items-center tracking-tight">
              <Utensils className="w-4 h-4 text-[#00BFA5] mr-2" />
              以家养剩菜反向搜索菜谱
            </h3>
            
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={recipeQuery}
                  onChange={(e) => setRecipeQuery(e.target.value)}
                  placeholder="输入现存食材（如西红柿、鸡胸肉）"
                  className="w-full bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl pl-4 pr-10 py-3.5 text-sm text-[#1A202C] outline-none focus:border-[#00BFA5] focus:bg-white focus:ring-1 focus:ring-[#00BFA5]/20 placeholder:text-[#A0AEC0] transition-colors"
                />
                {recipeQuery && (
                  <button
                    onClick={() => setRecipeQuery("")}
                    className="absolute right-3 top-4 text-[#A0AEC0] hover:text-[#4A5568] focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={handleAiMealPlanner}
                className="bg-[#1A202C] text-white font-bold text-xs px-4 py-3.5 rounded-2xl flex items-center space-x-1.5 shadow-sm select-none hover:bg-[#2D3748] transition-colors focus:outline-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI定制</span>
              </button>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none pt-2">
              {["全部", "家常菜", "快手菜", "减脂餐", "甜品"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setRecipeFilter(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none focus:outline-none ${
                    recipeFilter === tag
                      ? "bg-[#1A202C] text-white shadow-sm"
                      : "bg-[#F7FAFC] border border-[#E2E8F0] text-[#718096] hover:bg-[#E2E8F0]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* AI generated dynamic recipe if active */}
          {aiDishLoading && (
            <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm flex items-center justify-center space-x-3 py-10">
              <RefreshCw className="w-5 h-5 animate-spin text-[#00BFA5]" />
              <span className="text-sm font-medium text-[#718096]">智脑管家正在为你定制方案...</span>
            </div>
          )}

          {aiDishResult && (
            <div className="bg-[#F7FAFC] rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm relative space-y-3">
              <button
                onClick={() => setAiDishResult("")}
                className="absolute right-4 top-4 text-[#A0AEC0] hover:text-[#4A5568] focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="text-sm font-bold text-[#1A202C] flex items-center mb-2 tracking-tight">
                <Sparkles className="w-4 h-4 text-[#00BFA5] mr-2" />
                冰箱救急 AI 定制私厨
              </h4>
              <div className="text-sm text-[#4A5568] whitespace-pre-wrap bg-white p-5 rounded-2xl border border-[#E2E8F0] leading-relaxed shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                {aiDishResult}
              </div>
            </div>
          )}

          {/* Classic curated lists */}
          <div className="grid grid-cols-2 gap-4">
            {filteredRecipes.map((r) => (
              <div
                key={r.id}
                onClick={() => setDetailRecipe(r)}
                className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E0] transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mt-1 mb-3">{r.imgUrl}</div>
                  <h4 className="text-sm font-bold text-[#1A202C] line-clamp-1 leading-tight">{r.title}</h4>
                  <p className="text-[10px] text-[#718096] mt-2 line-clamp-2 leading-relaxed">
                    {r.description}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#F7FAFC] flex items-center justify-between text-[10px] text-[#4A5568] font-bold">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#00BFA5]" />
                    {r.cookingTime}
                  </span>
                  <span className="bg-[#F7FAFC] border border-[#E2E8F0] px-2 py-1 rounded-md text-[#718096]">
                    {r.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Fallback empty view */}
          {filteredRecipes.length === 0 && (
            <div className="bg-white rounded-[32px] p-10 border border-[#E2E8F0] text-center space-y-3">
              <HelpCircle className="w-10 h-10 text-[#CBD5E0] mx-auto" />
              <p className="text-sm font-bold text-[#4A5568]">暂未搜索到该食材搭配</p>
              <p className="text-xs text-[#A0AEC0]">试试点击右上角的 “AI定制” 按钮，由智脑现场生成</p>
            </div>
          )}

          {/* Step Detail Modal popup */}
          {detailRecipe && (
            <div className="fixed inset-0 bg-[#1A202C]/60 backdrop-blur-sm z-50 flex items-end justify-center">
              <div className="bg-white rounded-t-[32px] p-6 max-w-md w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative animate-slide-up">
                <button
                  onClick={() => setDetailRecipe(null)}
                  className="absolute right-5 top-5 bg-[#F7FAFC] border border-[#E2E8F0] text-[#718096] hover:text-[#1A202C] rounded-full p-2 cursor-pointer focus:outline-none transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{detailRecipe.imgUrl}</span>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A202C] tracking-tight">{detailRecipe.title}</h3>
                    <div className="flex space-x-2 mt-2">
                      {detailRecipe.tags.map((tg) => (
                        <span key={tg} className="bg-[#1A202C] text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wide">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#4A5568] font-medium bg-[#F7FAFC] p-4 rounded-2xl border-l-4 border-[#00BFA5] leading-relaxed">
                  {detailRecipe.description}
                </p>

                {/* Ingredients checklist */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#1A202C] flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#00BFA5] mr-2" />
                    食材清单 (2人份标准)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 bg-[#F7FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    {detailRecipe.ingredients.map((ing, i) => (
                      <div key={i} className="text-xs text-[#4A5568] font-medium flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E0] mr-2"></span>
                        {ing}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step lists instructions */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#1A202C] flex items-center pb-3 border-b border-[#E2E8F0]">
                    <Zap className="w-4 h-4 text-[#00BFA5] mr-2" />
                    傻瓜式极简步骤
                  </h4>
                  <div className="space-y-4">
                    {detailRecipe.steps.map((st, i) => (
                      <div key={i} className="flex space-x-3 items-start">
                        <span className="bg-[#1A202C] text-white rounded-xl w-6 h-6 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-sm">
                          {i + 1}
                        </span>
                        <p className="text-sm text-[#4A5568] leading-relaxed font-medium">
                          {st}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 2: CAREER PROGRESS & TRENDS FLOW  */}
      {/* ========================================== */}
      {subTab === "job" && (
        <div className="space-y-6 animate-fade-in">
          {/* Trends lists */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-[#1A202C] flex items-center tracking-tight">
              <TrendingUp className="w-4 h-4 text-[#00BFA5] mr-2" />
              18-35岁热门青年求职趋势
            </h3>

            <div className="space-y-4 pb-2">
              {STATIC_JOBS_DATA.map((job) => (
                <div
                  key={job.title}
                  onClick={() => setSelectedJob(job)}
                  className={`border rounded-2xl p-4 transition-all cursor-pointer ${
                    selectedJob?.title === job.title
                      ? "border-[#1A202C] bg-[#F7FAFC] shadow-sm"
                      : "border-[#E2E8F0] hover:border-[#CBD5E0]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-[#1A202C] tracking-tight">{job.title}</h4>
                      <p className="text-[10px] text-[#718096] mt-1.5 font-mono font-medium">
                        薪资区间：<span className="text-[#2D3748] font-bold">{job.salaryRange}</span>
                      </p>
                    </div>
                    <span className="text-[10px] bg-[#E0F2F1] text-[#00796B] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {job.demandGrowth}
                    </span>
                  </div>

                  {/* Hot keywords cards */}
                  {selectedJob?.title === job.title && (
                    <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex flex-wrap gap-2">
                      <span className="text-[10px] text-[#A0AEC0] self-center">核心抓手:</span>
                      {job.hotKeywords.map((tag) => (
                        <span key={tag} className="bg-white border border-[#E2E8F0] text-[#4A5568] text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Polished custom SVG chart for salary analysis */}
          <div className="bg-[#1A202C] text-white rounded-[32px] p-6 shadow-sm space-y-5">
            <h4 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-widest border-b border-white/10 pb-3">
              📊 2026行业对比数据 (元)
            </h4>

            {/* Custom crafted layout bars */}
            <div className="space-y-4">
              {[
                { label: "AI研发与调优 (平均)", minVal: 15, maxVal: 32 },
                { label: "跨境电商运营 (平均)", minVal: 8, maxVal: 18 },
                { label: "新能源技术员 (平均)", minVal: 10, maxVal: 22 },
                { label: "低空控制运营 (平均)", minVal: 9, maxVal: 17 }
              ].map((bar, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[#E2E8F0] font-bold font-mono tracking-wide">
                    <span>{bar.label}</span>
                    <span>{bar.minVal}K - {bar.maxVal}K</span>
                  </div>
                  {/* Inline visual bar */}
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden relative">
                    <div
                      className="absolute h-full bg-white rounded-full transition-all"
                      style={{ width: `${(bar.maxVal / 35) * 100}%` }}
                    />
                    <div
                      className="absolute h-full bg-[#00BFA5] rounded-full transition-all opacity-80"
                      style={{ width: `${(bar.minVal / 35) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[9px] text-[#A0AEC0] pt-4 text-center tracking-widest font-mono">
              *公开岗位招聘底薪指数*
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 3: LIFE HACKS & SURVIVAL TRIVIA   */}
      {/* ========================================== */}
      {subTab === "hack" && (
        <div className="space-y-4 animate-fade-in">
          {MORE_LIFE_HACKS.map((hack) => (
            <div
              key={hack.id}
              className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-4 hover:border-[#CBD5E0] transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="bg-[#1A202C] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm">
                  {hack.category}
                </span>
                <span className="text-[10px] text-[#A0AEC0] font-mono tracking-widest uppercase">极简妙招</span>
              </div>
              <h4 className="text-base font-bold text-[#1A202C] leading-snug tracking-tight">{hack.title}</h4>
              <p className="text-xs text-[#4A5568] font-medium bg-[#F7FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] leading-relaxed">
                {hack.summary}
              </p>
              <div className="text-sm text-[#4A5568] leading-relaxed font-medium whitespace-pre-wrap pl-4 border-l-2 border-[#00BFA5] space-y-2 py-1">
                {hack.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

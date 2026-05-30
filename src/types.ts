/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppTab = "home" | "tools" | "ai" | "services" | "profile";

export interface WeatherData {
  temp: string;
  feelsLike: string;
  icon: string;
  text: string;
  windSpeed: string;
  humidity: string;
  aqi?: string;
  cityName: string;
  forecast?: Array<{
    date: string;
    tempMax: string;
    tempMin: string;
    textDay: string;
    textNight: string;
  }>;
}

export interface ExpressStep {
  time: string;
  context: string;
}

export interface ExpressData {
  nu: string;
  com: string;
  state: string; // "0" (intransit), "1" (pickedup), "3" (signed), etc.
  status: string; // readable text
  data: ExpressStep[];
}

export interface Recipe {
  id: string;
  title: string;
  imgUrl: string;
  tags: string[];
  difficulty: "简单" | "中等" | "困难";
  cookingTime: string;
  ingredients: string[];
  steps: string[];
  description: string;
}

export interface JobTrend {
  title: string;
  salaryRange: string;
  demandGrowth: string;
  hotKeywords: string[];
  recommendationRating: number;
}

export interface LifeHack {
  id: string;
  category: "省钱妙招" | "居家日常" | "求职升职" | "租房避坑" | "健康养生" | "应急科普";
  title: string;
  summary: string;
  content: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  remark: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface UserSettings {
  userName: string;
  budgetMonthly: number;
  theme: "light" | "dark";
  notifications: boolean;
}

import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. 從環境變數讀取 API Key (這符合您的資安存放規則)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 2. 初始化 Gemini SDK
const genAI = new GoogleGenerativeAI(API_KEY);

// 3. 設定模型（建議使用 gemini-1.5-flash，速度快且免費額度高）
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { images } = req.body;
    // 重點：正式版改用 process.env 抓取，不再寫死在程式碼中
    const API_KEY = process.env.GEMINI_API_KEY; 
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `你是專業營養師營養小精靈。請分析這張食品圖片，並嚴格遵守以下 JSON 格式回傳，確保 translations 必須是一個陣列(Array)：
{
  "productName": "產品名稱",
  "verdict": { "title": "評分", "color": "green/yellow/red" },
  "highlights": [{ "label": "熱量", "value": "200kcal" }],
  "translations": [{ "origin": "成分名", "explain": "解釋" }],
  "advice": { "target": "誰適合", "warning": "提醒", "action": "建議" }
}
請用繁體中文回答。`;
    const imageParts = images.map(img => ({
      inlineData: { data: img.split(',')[1], mimeType: "image/jpeg" }
    }));

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    res.status(200).json(JSON.parse(response.text().replace(/```json|```/g, "")));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
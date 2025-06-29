import axios from "axios";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = "YOUR_DEEPSEEK_API_KEY"; // 替换为你的API Key

export async function searchToMarkdownOutline(query: string): Promise<string> {
  const prompt = `请根据以下主题生成一份结构化的Markdown大纲，适合用于思维导图，内容简明扼要：\n\n主题：${query}\n\nMarkdown大纲：`;
  const res = await axios.post(
    DEEPSEEK_API_URL,
    {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
    }
  );
  return res.data.choices?.[0]?.message?.content || "";
} 
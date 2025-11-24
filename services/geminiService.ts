import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

// Initialize the Gemini AI client with the system-provided API Key
// process.env.API_KEY is automatically injected by the platform.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to convert a File object to a base64 string for the API.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") to get raw base64
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes text and images using Google Gemini 2.5 Flash.
 */
export const analyzeScamContent = async (text: string, images: File[]): Promise<AnalysisResult> => {
  // Simple check to ensure key exists (though environment usually guarantees it)
  if (!process.env.API_KEY) {
    throw new Error("系统未检测到 API Key。请检查环境变量配置。");
  }

  try {
    // 1. Prepare Image Data
    const imageParts = await Promise.all(images.map(fileToGenerativePart));

    // 2. Define System Instruction (Expert Persona)
    const systemInstruction = `
      你是一个专业的、中文的反诈骗 AI 分析师 (ScamGuard AI)，拥有20年犯罪心理学经验。
      你的任务是根据用户提供的文本和截图（聊天记录），分析其诈骗风险。

      输入处理逻辑：
      - **模拟指令**：如果用户输入简短指令如"测试杀猪盘"、"测试刷单"，请先生成一段逼真的诈骗对话放入 'generatedConversation' 字段，然后再分析它。
      - **真实分析**：如果用户上传了图片或一段对话，请直接分析内容，'generatedConversation' 设为 null。

      分析要求：
      1. **深度意图识别**：不要只看表面。核心动机是什么？（钱、隐私、账号？）
      2. **心理操控**：识别煤气灯效应、紧迫感、权威压迫等手段。
      3. **风险评分**：0-100分。

      输出格式：
      请严格返回以下 JSON 格式 (不要包含 Markdown 代码块):
      {
        "riskScore": number, // 0-100
        "riskLevel": "SAFE" | "SUSPICIOUS" | "DANGEROUS" | "CRITICAL",
        "summary": "String (中文总结)",
        "generatedConversation": "String? (仅在模拟模式下存在，否则为null)",
        "scammerMotive": "String (中文，一针见血的核心动机)",
        "expectedOutcome": "String (中文，如果不停止会发生什么)",
        "redFlags": ["String", "String", ...], // 3-5个关键疑点
        "psychologicalTactics": ["String", "String", ...], // 心理战术名词
        "verificationStrategies": [
          { 
            "type": "String", 
            "explanation": "String", 
            "reply": "String", // 给用户复制的反击话术
            "expectedReaction": "String" 
          }
        ],
        "actionableAdvice": "String (中文行动建议)",
        "scamAlertMessage": "String (用于海报的中文警示语，使用Emoji，语气强烈)"
      }
    `;

    // 3. Call the API using the correct method signature
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          ...imageParts, // Attach images
          { text: `用户输入内容：${text}` }
        ]
      },
      config: {
        systemInstruction: systemInstruction, // System instruction goes here in config
        responseMimeType: "application/json" // Force JSON output
      }
    });

    // 4. Parse and Return
    const responseText = response.text;
    if (!responseText) {
      throw new Error("AI 返回了空响应，请重试。");
    }

    // Clean up potential Markdown formatting (```json ... ```) just in case
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
       cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const result = JSON.parse(cleanJson) as AnalysisResult;
    return result;

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    // Provide a user-friendly error message
    // Note: 'net::ERR_BLOCKED_BY_CLIENT' often appears in console due to ad-blockers blocking log endpoints,
    // but the real API error might be different.
    let errorMessage = error.message || "智能分析服务暂时不可用";
    if (errorMessage.includes("400")) errorMessage += " (请求无效)";
    if (errorMessage.includes("403")) errorMessage += " (API Key 权限不足)";
    if (errorMessage.includes("500")) errorMessage += " (AI 服务繁忙)";
    
    throw new Error(`${errorMessage}。请检查网络连接或稍后重试。`);
  }
};
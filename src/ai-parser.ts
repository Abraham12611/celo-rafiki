import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const SITE_URL = "https://celo-rafiki.com"; // Placeholder URL
const SITE_NAME = "Celo Rafiki Agent";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": SITE_NAME,
  },
});

export async function parseCommand(text: string): Promise<{ intent: string; amount?: number; currency?: string; recipient?: string } | null> {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        {
          role: "system",
          content: `You are a financial intent parser for a crypto wallet bot.
          User input will be natural language.
          
          Extract the following:
          - intent: "send", "balance", "wallet", or "unknown"
          - amount: number (if sending)
          - currency: "USDC" or "CELO" (default to USDC if ambiguous money terms used)
          - recipient: phone number (e.g., +254...) or wallet address (0x...)
          
          Output ONLY JSON. No markdown. No chatter.
          
          Example: "Send 5 bucks to +2348012345678"
          {"intent": "send", "amount": 5, "currency": "USDC", "recipient": "+2348012345678"}
          
          Example: "Check my money"
          {"intent": "balance"}
          
          Example: "What is my address"
          {"intent": "wallet"}
          
          Example: "Hello"
          {"intent": "unknown"}`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) return null;

    // Clean up potential markdown code blocks if the model adds them
    const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanContent);
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return null;
  }
}

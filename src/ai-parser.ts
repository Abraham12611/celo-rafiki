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

export async function parseCommand(text: string): Promise<{ 
    intent: string; 
    amount?: number; 
    currency?: string; 
    recipient?: string;
    fromToken?: string;
    toToken?: string;
    interval?: string;
} | null> {

  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        {
          role: "system",
          content: `You are a financial intent parser for a crypto wallet bot.
          User input will be natural language.
          
          Extract the following:
          - intent: "send", "swap", "balance", "wallet", "remind", or "unknown"
          - amount: number
          - currency: "USDC", "cUSD", "cEUR", "CELO", "BRL", "XOF" (normalize to ticker)
          - recipient: phone number or address (for send/remind)
          - fromToken: symbol (for swap)
          - toToken: symbol (for swap)
          - interval: "day", "week", "month" (for remind)
          
          Instructions:
          1. Detect language (English, Spanish, French, Portuguese).
          2. Parse amounts like "50 euros" -> currency: "cEUR".
          3. Parse "reais" -> currency: "BRL".
          4. Parse "francs" / "XOF" -> currency: "XOF".
          
          Example (ES): "Envía 10 euros a mi hermano +34..."
          {"intent": "send", "amount": 10, "currency": "cEUR", "recipient": "+34..."}
          
          Example (PT): "Mandar 20 reais"
          {"intent": "send", "amount": 20, "currency": "BRL", "recipient": null}

          Example (EN): "Remind me to send 5 USDC to +123 every week"
          {"intent": "remind", "amount": 5, "currency": "USDC", "recipient": "+123", "interval": "week"}
          
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

# Product Requirements Document (PRD) - Rafiki (Agent M-Pesa)

## 1. Executive Summary
**Rafiki** ("Friend" in Swahili) is an AI-powered remittance agent living natively in WhatsApp/Telegram. It bridges the gap between complex DeFi protocols and the everyday user in emerging markets. Rafiki allows users to send stablecoins (cUSD/USDC/EURm) using natural language, leveraging Celo's mobile-first infrastructure and SocialConnect for phone-number-based identity.

## 2. Problem Statement
*   **Complexity:** Crypto wallets are intimidating (seed phrases, gas fees, 0x addresses).
*   **Friction:** Sending money requires multiple apps, copy-pasting addresses, and fear of loss.
*   **Hidden Costs:** Traditional remittance (Western Union, Wise) takes 5-10% in fees and takes days.
*   **Language Barrier:** Interfaces are often English-only, excluding LatAm/Francophone Africa users.

## 3. Solution
An autonomous agent that acts as a "Concierge Banker".
*   **Interface:** Text & Voice-based (Low data, high familiarity).
*   **Logic:** Natural Language Processing (NLP) to parse intents in English, Spanish, Portuguese, and French.
*   **Rail:** Celo Blockchain (Fast, sub-cent fees, stablecoin native).
*   **Liquidity:** Mento Protocol for instant multi-currency swaps (e.g., cUSD to cEUR).
*   **Identity:** Maps Phone Numbers -> Wallet Addresses (SocialConnect).

## 4. Key Features

### P0: Core Hackathon Requirements (The Foundation)
1.  **Multi-Language NLP:** Understands intent in 4 languages:
    *   "Send $50 to my mom" (English)
    *   "Envía 10 euros a mi hermano" (Spanish)
    *   "Envoyer 5000 XOF à maman" (French)
    *   "Mandar 20 reais" (Portuguese)
2.  **SocialConnect Integration:** Resolves global phone numbers to Celo addresses automatically.
3.  **Mento Swaps (Multi-Corridor):** Automatic conversion via Mento.
    *   *User Input:* "Send 10 Euro to [US-Number]"
    *   *Action:* Swaps cUSD (Wallet) -> cEUR -> Recipient.
4.  **Fee Comparison:** "Savings Receipt" showing the difference between Celo fees (<$0.001) and Western Union (~$5.00).
5.  **Recurring Transfers:** "Send $10 to Mom every Friday". (Implemented via Cron).

### P1: "Above and Beyond" (The Winning Edge)
1.  **Gas Abstraction:** Users/Agents pay gas in stablecoins (cUSD/USDC), removing the need to hold CELO token.
2.  **Voice Note Support:** Integration with Whisper API to parse audio commands sent via WhatsApp/Telegram.
    *   *Input:* [Audio File] "Rafiki, tuma pesa..."
    *   *Output:* "Understood. Sending..."
3.  **MiniPay Deep-Linking:** If the user is on Opera MiniPay, the agent generates a deep link (`celo://wallet/pay...`) for trustless signing instead of custodial execution.

## 5. User Stories
*   *As a sender*, I want to speak in my native language (Portuguese) and have the agent understand my currency (Real/BRLm).
*   *As a recipient*, I want to receive a WhatsApp notification when funds arrive.
*   *As a saver*, I want to see exactly how much I saved compared to a bank transfer.

## 6. Technical Stack
*   **Agent Framework:** OpenClaw (Node.js/TypeScript)
*   **Blockchain:** Celo Sepolia (Testnet) / Celo Mainnet
*   **SDKs:**
    *   `@celo/identity` (SocialConnect)
    *   `@mento-protocol/mento-sdk` (Swaps)
    *   `viem` (Transactions & Gas Abstraction)
*   **AI:** OpenAI/OpenRouter (LLM & Whisper)
*   **Notifications:** Twilio / Telegram API

## 7. Success Metrics
*   **Transaction Time:** < 5 seconds.
*   **Success Rate:** 95% NLP intent accuracy across 4 languages.
*   **Savings:** Displayed savings > $3.00 per transaction vs traditional rails.

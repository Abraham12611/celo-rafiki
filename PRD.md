# Product Requirements Document (PRD) - Rafiki (Agent M-Pesa)

## 1. Executive Summary
**Rafiki** ("Friend" in Swahili) is an AI-powered remittance agent living natively in WhatsApp/Telegram. It bridges the gap between complex DeFi protocols and the everyday user in emerging markets. Rafiki allows users to send stablecoins (cUSD/USDC) using natural language, leveraging Celo's mobile-first infrastructure and SocialConnect for phone-number-based identity.

## 2. Problem Statement
*   **Complexity:** Crypto wallets are intimidating (seed phrases, gas fees, 0x addresses).
*   **Friction:** Sending money requires multiple apps, copy-pasting addresses, and fear of loss.
*   **Data Cost:** High-bandwidth apps don't work well in target markets (Africa/LatAm).

## 3. Solution
An autonomous agent that acts as a "Concierge Banker".
*   **Interface:** Text-based (Low data, high familiarity).
*   **Logic:** Natural Language Processing (NLP) to parse intents ("Pay John $10").
*   **Rail:** Celo Blockchain (Fast, sub-cent fees, stablecoin native).
*   **Identity:** Maps Phone Numbers -> Wallet Addresses (SocialConnect).

## 4. Key Features

### P0 (MVP - Hackathon Scope)
1.  **Natural Language Parsing:** Understands "Send [Amount] [Token] to [Name/Number]".
2.  **SocialConnect Integration:** Resolves phone numbers to Celo addresses automatically.
3.  **Stablecoin Support:** Native support for cUSD and USDT.
4.  **Transaction Preview:** Agent responds with "Confirm sending 10 cUSD to +254...?"
5.  **MiniPay Deep-Linking:** If user uses Opera MiniPay, trigger native signature flow.

### P1 (Post-Hackathon)
1.  **Voice Notes:** "I want to send money" (Audio -> Text -> Action).
2.  **On/Off Ramps:** Integration with local mobile money (M-Pesa) via partners (Kotani Pay/Fonbnk).
3.  **Yield Savings:** "Save this money for me" -> Auto-deposit into Moola/GoodGhosting.

## 5. User Stories
*   *As a sender*, I want to type "Send 5 dollars to my brother" so that I don't have to ask for his blockchain address.
*   *As a recipient*, I want to receive a text notification when I get money.
*   *As a developer*, I want the agent to handle gas fees (Gas Station/Fee Abstraction) so the user doesn't need CELO token.

## 6. Success Metrics
*   **Transaction Time:** < 5 seconds from "Send" to "Hash Generated".
*   **Success Rate:** 90% NLP intent recognition accuracy.
*   **Cost:** Transaction fee < $0.01.

# Technology Stack

## Core
*   **Language:** TypeScript
*   **Runtime:** Node.js (v20+)
*   **Repo Manager:** npm / yarn

## Blockchain (Celo)
*   **Client:** `viem` (Standard for Celo interaction)
*   **Identity:** `@celo/identity` (SocialConnect wrapper)
*   **Network:** Celo Alfajores (Testnet) -> Celo Mainnet
*   **Contracts:** Native Stablecoin Contracts (cUSD, cEUR, USDT)

## AI / Agent
*   **Model:** GPT-4o-mini (Fast, cheap) or Claude 3.5 Haiku.
*   **Framework:** Manual function calling (Keep it lightweight) or `ai` (Vercel SDK).

## Messaging
*   **Platform:** Telegram (`telegraf` or `grammy` library).
    *   *Why:* Free, easy to bot, crypto-native audience.
*   **Alternative:** Twilio (`twilio` node lib) for WhatsApp.

## Database
*   **Type:** Key-Value (Redis) or Document (Supabase/Postgres).
*   **Use:** Session storage (Conversation history), User mappings.

## Hosting
*   **Service:** Vercel (Serverless Functions) or Railway (Docker container).
*   **CI/CD:** GitHub Actions.

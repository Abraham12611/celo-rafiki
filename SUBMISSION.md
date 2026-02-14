# Moltiverse Hackathon Submission: Celo Rafiki 📱

## Summary
Celo Rafiki ("Friend" in Swahili) is an AI concierge that enables users to send global remittances using natural language on Telegram/WhatsApp, leveraging Celo's mobile-first infrastructure.

## What I Built
An autonomous agent that abstracts blockchain complexity (gas fees, addresses, swaps) behind a familiar chat interface. It uses SocialConnect for phone-number-based identity and Mento for instant currency conversion.

### Key Features:
- **Multi-Language NLP:** Understands intents in English, Spanish, French, and Portuguese.
- **SocialConnect Identity:** Resolves phone numbers to Celo addresses via ODIS.
- **Mento Multi-Corridor Swaps:** Atomic conversion between stablecoins (cUSD, cEUR, cREAL).
- **Savings Analytics:** Transparent dashboard showing TradFi vs. Celo fee savings.
- **MiniPay Deep-Linking:** Flexible signing (Custodial or Non-Custodial via Opera MiniPay).

## How It Functions
1. **Natural Intent:** User inputs a command like "Send $10 to my sister +254...".
2. **AI Parsing:** Llama 3 (via OpenRouter) extracts amount, currency, and recipient identifier.
3. **Identity Resolution:** Queries ODIS to map the identifier to an on-chain address.
4. **Prepare & Swap:** If currency mismatch occurs, Mento SDK prepares an atomic swap.
5. **Execution:** Transaction is signed by the agent (using fee abstraction in cUSD) or proposed via MiniPay link.
6. **Analytics:** Transaction is logged to the savings dashboard for user review.

## Proof of Work
- **GitHub Repository:** https://github.com/Abraham12611/celo-rafiki
- **Video Demo:** [INSERT_VIDEO_URL_HERE]
- **Live Network:** Celo Alfajores Testnet

## Why It Matters
Traditional remittances take 5-10% in fees and take days to settle. Celo Rafiki provides sub-cent fees, instant settlement, and works in the user's native language. It bridges the gap between DeFi and the next billion users in emerging markets.

---
**Track:** Agent Track (No Token Required)
**Built with:** OpenClaw, Celo, Mento, SocialConnect, OpenRouter

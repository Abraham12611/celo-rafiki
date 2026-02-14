# 📱 Celo Rafiki

> **Build with Celo 2026** — AI-Powered Remittance Agent for Mobile-First Payments

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Telegraf](https://img.shields.io/badge/Telegraf-4.15-orange)](https://telegraf.js.org/)
[![Celo](https://img.shields.io/badge/Celo-Alfajores-green)](https://celo.org/)
[![Mento](https://img.shields.io/badge/Mento-SDK-yellow)](https://mento.org/)

**Celo Rafiki** ("Friend" in Swahili) is an AI concierge that enables users to send global remittances using natural language. It abstracts the complexity of blockchain (gas fees, addresses, swaps) behind a familiar chat interface (Telegram/WhatsApp), leveraging **SocialConnect** for phone-number-based identity and **Mento** for instant currency conversion.

## 🏗 Project Structure

```
celo-rafiki/
├── src/
│   ├── ai-parser.ts      # 🧠 NLP Intent Parsing (Llama 3 via OpenRouter)
│   ├── socialconnect.ts  # 🆔 Phone Number -> Address resolution (ODIS)
│   ├── swap.ts           # 💱 Mento Protocol integration
│   ├── fee-estimator.ts  # 📉 TradFi vs. Celo fee comparison
│   ├── minipay.ts        # 📱 MiniPay/Valora deep-link generation
│   └── index.ts          # 🤖 Telegram Bot Entry Point
├── package.json
└── tsconfig.json
```

## ⛓️ Celo Integration

Celo Rafiki leverages the core mobile-first features of the Celo blockchain to provide a seamless user experience.

### Alfajores Testnet Assets

| Asset | Address |
|-------|---------|
| **CELO** | [`0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9`](https://alfajores.celoscan.io/address/0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9) |
| **cUSD** | [`0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`](https://alfajores.celoscan.io/address/0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1) |
| **cEUR** | [`0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F`](https://alfajores.celoscan.io/address/0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F) |
| **USDC** | [`0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B`](https://alfajores.celoscan.io/address/0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B) |

### How It Works

1. **Natural Intent** → User says "Send $10 to my sister +254..." in English, Spanish, French, or Portuguese.
2. **AI Parsing** → Rafiki uses Llama 3 to extract the amount, currency, and recipient identifier.
3. **Identity Resolution** → **SocialConnect** (ODIS) maps the phone number to an on-chain Celo address.
4. **Multi-Corridor Swap** → If the user's balance is in cUSD but the recipient needs cEUR, **Mento** executes an atomic swap.
5. **Fee Optimization** → Rafiki calculates savings vs. Western Union/Wise and displays a "Savings Receipt."
6. **Flexible Signing** → User can let the Agent sign (custodial) or use a **MiniPay deep-link** to sign non-custodially.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Telegram Bot Token ([@BotFather](https://t.me/BotFather))
- OpenRouter API Key

### Setup & Installation

```bash
# 1. Clone & Install
git clone https://github.com/Abraham12611/celo-rafiki.git
cd celo-rafiki
npm install

# 2. Configure Environment
cp .env.example .env
# Fill in TELEGRAM_BOT_TOKEN, AGENT_PRIVATE_KEY, and OPENROUTER_API_KEY

# 3. Run in Dev Mode
npm start
```

## 🔌 Bot Commands

Interact with Rafiki via Telegram:

| Command | Description |
|---------|-------------|
| `/start` | Initialize Rafiki and view help |
| `/balance` | Check your gas (CELO) and stablecoin (USDC/cUSD) balances |
| `/wallet` | View your agent-managed wallet address |
| `Send 10 cUSD to +12345678` | Natural language remittance (Multi-lingual support) |
| `Swap 5 CELO to cUSD` | Instant conversion via Mento Protocol |

## 📊 Tech Stack

- **Framework**: Node.js & TypeScript
- **Agent Orchestration**: OpenClaw
- **Blockchain**: `viem` (Core Transactions), `ethers` v6 (Mento/ODIS support)
- **Identity**: `@celo/identity` (SocialConnect / ODIS)
- **DeFi**: `@mento-protocol/mento-sdk`
- **AI**: OpenAI SDK with Llama 3.3 70B (via OpenRouter)

## 🏆 Hackathon Prize Targets

| Prize | Our Angle |
|-------|-----------|
| **Remittance Intent Agent** | Primary target. Full implementation of the organizer's suggested idea. |
| **SocialConnect Integration** | First-class phone-number-to-address resolution for emerging markets. |
| **MiniPay / Mini App** | Mobile-optimized deep-linking for trustless signing in Opera MiniPay. |

## 📄 License

MIT

---

**Built for the Celo Hackathon 2026** • Powered by OpenClaw 🦞

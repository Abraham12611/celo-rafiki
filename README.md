# Celo Rafiki - AI Remittance Agent

An AI-powered Telegram bot for seamless stablecoin (USDC/cUSD) remittances on the Celo blockchain. Rafiki helps users check balances and send payments using simple commands.

## Features

- 💸 **Send USDC**: Transfer stablecoins instantly on Celo Sepolia Testnet.
- 💰 **Check Balance**: View both CELO (gas) and USDC balances.
- 🏦 **Wallet Info**: Easily view and copy your agent's wallet address.
- 🤖 **AI-Ready**: Built on a modular architecture ready for NLP integration.

## Prerequisites

- **Node.js**: v18 or higher
- **Telegram Account**: To interact with the bot.
- **Bot Token**: From [BotFather](https://t.me/BotFather).
- **Celo Wallet**: A private key for the agent (generated or existing).

## Setup Instructions

### 1. Clone and Install
```bash
git clone https://github.com/Abraham12611/celo-rafiki.git
cd celo-rafiki
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory and add the following variables:

```env
# Celo Network (Celo Sepolia Testnet)
CELO_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
CELO_CHAIN_ID=11142220

# Telegram Bot Token (Get from @BotFather)
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Agent Wallet Private Key (Keep Secret!)
# Format: 0x...
AGENT_PRIVATE_KEY=your_private_key_here

# Token Contracts (Celo Sepolia)
# USDC Contract Address
USDC_ADDRESS=0x01C5C0122039549AD1493B8220cABEdD739BC44E
```

### 3. Run the Bot
Start the bot in development mode:
```bash
npx ts-node src/index.ts
```
Or build and run:
```bash
npm run build
npm start
```

## How to Use

1. **Open Telegram** and find your bot.
2. **Start**: Send `/start` to wake up Rafiki.
3. **Check Funds**: Send `/balance` to see your CELO and USDC holdings.
4. **Get Address**: Send `/wallet` to get your deposit address.
5. **Send Money**:
   - Format: `Send <amount> USDC to <address>`
   - Example: `Send 5 USDC to 0x123...abc`

## Troubleshooting

- **No Funds?**: Get testnet CELO from the [Celo Faucet](https://faucet.celo.org/alfajores) (select Sepolia).
- **Transaction Failed?**: Ensure you have enough CELO for gas fees (~0.001 CELO per tx).

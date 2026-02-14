# 🗺️ Celo Rafiki Roadmap

## Phase 1: The Foundation (Core Requirements) ✅
- [x] **Project Setup**: Repository, TypeScript config, `.env`.
- [x] **Wallet Integration**: `viem` client, Celo Sepolia connection.
- [x] **SocialConnect**: Phone Number -> Address resolution (`src/socialconnect.ts`).
- [x] **Basic AI Parser**: English intent parsing ("Send X to Y").
- [x] **Multi-Language AI**: Update prompts to support Spanish, French, Portuguese.
- [x] **Mento Integration**: Implement `src/swap.ts` for cUSD/cEUR/CELO swaps.
- [x] **Fee Comparison**: Logic to calculate and display savings vs. TradFi.

## Phase 2: The Experience (User Features) ✅
- [x] **Recurring Transfers**: Placeholder command implemented; logic documented.
- [x] **Notifications**: User-facing receipts with fee savings logic.
- [x] **MiniPay Integration**: Generate `celo://` links for non-custodial signing.
- [ ] **Gas Abstraction**: Update `src/index.ts` to use `feeCurrency` (pay gas in cUSD).

## Phase 3: Above and Beyond (Winning Features) 🚧
- [x] **Voice Notes**: Telegram voice handler + Whisper PRD integration.
- [ ] **Analytics Dashboard**: Simple stats on total volume/savings.

## Current Status
**Progress:** ~85%
**Next Immediate Task:** Setup Recurring Transfers (Cron) or Voice Notes.

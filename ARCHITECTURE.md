# System Architecture

## High-Level Overview

```mermaid
graph TD
    User((User)) -->|WhatsApp/Telegram| Interface[Messaging Gateway]
    Interface -->|Webhook| AgentAPI[Node.js Agent API]
    
    subgraph "Rafiki Brain"
        AgentAPI -->|Parse Intent| LLM[LLM Service (OpenAI/Anthropic)]
        LLM -->|JSON Action| AgentAPI
    end
    
    subgraph "Celo Integration"
        AgentAPI -->|Lookup Identity| SocialConnect[Celo SocialConnect ODIS]
        AgentAPI -->|Prepare Tx| Viem[Viem/Wagmi SDK]
        Viem -->|Execute/Sign| CeloNetwork[Celo Blockchain]
    end
    
    subgraph "Data Store"
        AgentAPI -->|Persist Context| DB[(PostgreSQL/Redis)]
    end
```

## Components

### 1. Messaging Gateway
*   **Twilio (WhatsApp):** For enterprise-grade reliability.
*   **Telegram Bot API:** For developer/hackathon MVP ease.
*   *Role:* Receives text, sends text. No crypto logic here.

### 2. Agent Brain (Node.js)
*   **Framework:** TypeScript / Node.js.
*   **AI SDK:** Vercel AI SDK or LangChain.
*   **Role:**
    *   Maintains conversation state.
    *   Validates inputs (Is "5000 USD" within balance?).
    *   Formats confirmation messages.

### 3. Identity Layer (SocialConnect)
*   **Protocol:** ODIS (Oblivious Decentralized Identity Service).
*   **Function:** Privacy-preserving mapping of `E.164 Phone Number` <-> `0x Address`.
*   *Why:* Essential for "M-Pesa" feel. User sends to a number, not an address.

### 4. Blockchain Layer
*   **SDK:** `viem` (Lightweight, typed).
*   **Chain:** Celo Mainnet (or Alfajores Testnet for Dev).
*   **Tokens:** cUSD, USDT.
*   **Fee Abstraction:** Pay gas in Stablecoins (Celo native feature).

## Data Flow (Send Money)

1.  **Ingest:** `POST /webhook` receives message body.
2.  **Think:** LLM extracts `{ intent: "SEND", amount: 10, token: "cUSD", recipient: "+254..." }`.
3.  **Resolve:** System queries SocialConnect for `+254...`. Returns `0xABC...`.
4.  **Construct:** System builds EVM transaction `transfer(0xABC, 10)`.
5.  **Propose:** Agent replies "Found wallet 0xABC. Reply 'YES' to sign."
6.  **Execute:**
    *   *Custodial (Lite):* Agent signs with ephemeral key (if user deposited funds).
    *   *Non-Custodial (MiniPay):* Agent sends `minipay://` deep link for user to sign.
7.  **Confirm:** Agent listens for receipt, sends success message.

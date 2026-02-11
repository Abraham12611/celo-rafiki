import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { createWalletClient, http, publicActions } from "viem";
import { celoSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is missing!");
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Blockchain Setup
const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY as `0x${string}` || "0x0000000000000000000000000000000000000000000000000000000000000000");
const client = createWalletClient({
    account,
    chain: celoSepolia,
    transport: http(process.env.CELO_RPC_URL)
}).extend(publicActions);

const USDC_ABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
    }
] as const;

// 1. Start Command
bot.start((ctx) => {
    ctx.reply(`👋 Jambo! I am Rafiki, your Celo Remittance Agent.
    
I can help you send USDC to anyone using just their phone number.

*Try these commands:*
- /balance : Check your agent wallet balance (CELO & USDC)
- "Send 5 USDC to +254700000000" (Coming Soon)
- /wallet : View your agent wallet address
    `, { parse_mode: "Markdown" });
});

// 2. Wallet Info
bot.command("wallet", (ctx) => {
    ctx.reply(`🏦 *Your Agent Wallet*
    
Address: \`${account.address}\`
    
Network: Celo Sepolia (Testnet)
    `, { parse_mode: "Markdown" });
});

// 3. Balance Check
bot.command("balance", async (ctx) => {
    try {
        const balance = await client.getBalance({ address: account.address });
        const celo = Number(balance) / 1e18;

        const usdcBalance = await client.readContract({
            address: process.env.USDC_ADDRESS as `0x${string}`,
            abi: USDC_ABI,
            functionName: 'balanceOf',
            args: [account.address]
        });
        const usdc = Number(usdcBalance) / 1e6; // USDC has 6 decimals

        ctx.reply(`💰 *Wallet Balance*
        
CELO: ${celo.toFixed(4)} (Gas)
USDC: ${usdc.toFixed(2)}
        `, { parse_mode: "Markdown" });
    } catch (error) {
        console.error(error);
        ctx.reply("⚠️ Error fetching balance. Please check logs.");
    }
});

import { lookupPhoneNumber } from "./socialconnect";

// ... (existing imports)

// 4. Send Command (Updated)
bot.hears(/^send (\d+(\.\d+)?) usdc to (.*)$/i, async (ctx) => {
    const amount = parseFloat(ctx.match[1]);
    let recipient = ctx.match[3];

    // Check if recipient is a phone number
    if (recipient.startsWith("+")) {
        ctx.reply(`🔍 Searching SocialConnect for ${recipient}...`);
        const resolvedAddress = await lookupPhoneNumber(recipient, process.env.AGENT_PRIVATE_KEY as string);
        
        if (resolvedAddress) {
            ctx.reply(`✅ Found address: \`${resolvedAddress}\``, { parse_mode: "Markdown" });
            recipient = resolvedAddress;
        } else {
            return ctx.reply(`⚠️ No wallet found for ${recipient}. They may need to register with SocialConnect (MiniPay/Valora).`);
        }
    }

    if (!recipient.startsWith("0x")) {
        return ctx.reply("❌ Invalid address or phone number.");
    }

    ctx.reply(`💸 Sending ${amount} USDC to ${recipient}...`);

    try {
        const hash = await client.writeContract({
            address: process.env.USDC_ADDRESS as `0x${string}`,
            abi: USDC_ABI,
            functionName: 'transfer',
            args: [recipient as `0x${string}`, BigInt(amount * 1e6)] // USDC 6 decimals
        });

        ctx.reply(`✅ Transaction Sent!
        
Hash: \`${hash}\`
Explorer: https://celo-sepolia.blockscout.com/tx/${hash}`, { parse_mode: "Markdown" });
    } catch (error: any) {
        console.error(error);
        ctx.reply(`❌ Failed: ${error.shortMessage || error.message}`);
    }
});

// 5. Fallback (NLP Placeholder)
bot.on("text", (ctx) => {
    const text = ctx.message.text;
    if (!text.startsWith('/')) {
        ctx.reply(`🤖 I heard: "${text}".
        
To send money, use format:
"Send 5 USDC to 0x..."`);
    }
});

// Launch
console.log("🚀 Rafiki Agent is starting...");
bot.launch();

// Graceful Stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

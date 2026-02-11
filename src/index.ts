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

// 4. Fallback (NLP Placeholder)
bot.on("text", (ctx) => {
    const text = ctx.message.text;
    ctx.reply(`🤖 I heard: "${text}". My AI brain is still being built, but I successfully received your message!`);
});

// Launch
console.log("🚀 Rafiki Agent is starting...");
bot.launch();

// Graceful Stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

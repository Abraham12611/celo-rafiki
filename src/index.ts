import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { createWalletClient, http, publicActions } from "viem";
import { celoAlfajores } from "viem/chains";
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
    chain: celoAlfajores,
    transport: http(process.env.CELO_RPC_URL)
}).extend(publicActions);

// 1. Start Command
bot.start((ctx) => {
    ctx.reply(`👋 Jambo! I am Rafiki, your Celo Remittance Agent.
    
I can help you send money to anyone using just their phone number.

*Try these commands:*
- /balance : Check your agent wallet balance
- "Send 5 cUSD to +254700000000" (Coming Soon)
- /wallet : View your agent wallet address
    `, { parse_mode: "Markdown" });
});

// 2. Wallet Info
bot.command("wallet", (ctx) => {
    ctx.reply(`🏦 *Your Agent Wallet*
    
Address: \`${account.address}\`
    
Network: Celo Alfajores (Testnet)
    `, { parse_mode: "Markdown" });
});

// 3. Balance Check
bot.command("balance", async (ctx) => {
    const balance = await client.getBalance({ address: account.address });
    const eth = Number(balance) / 1e18;
    ctx.reply(`💰 Balance: ${eth.toFixed(4)} CELO`);
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

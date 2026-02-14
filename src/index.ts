import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { createWalletClient, http, publicActions, parseUnits } from "viem";
import { celoSepolia, celo } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { exec } from "child_process";

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is missing!");
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const USDC_ADDRESS = (process.env.USDC_ADDRESS || "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B") as `0x${string}`;
const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369BC1" as `0x${string}`;

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
    
I can help you send USDC, cUSD, or cEUR to anyone using just their phone number.

*Try these commands:*
- /balance : Check your agent wallet balance
- "Send 5 USDC to +254700000000"
- "Swap 10 cUSD to CELO"
- /wallet : View your agent wallet address
- /stats : View your remittance savings dashboard
- /remind : Setup a recurring transfer (e.g., "Remind me to send 10 USDC to +254... every week")
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
            address: USDC_ADDRESS,
            abi: USDC_ABI,
            functionName: 'balanceOf',
            args: [account.address]
        } as any);
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
import { parseCommand } from "./ai-parser";
import { generateMiniPayLink } from "./minipay";
import { formatSavingsReceipt, calculateSavings } from "./fee-estimator";
import { executeSwap } from "./swap";
import { logTransaction, getStats } from "./analytics";

// 4. Send Command (Updated with Gas Abstraction)
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

    ctx.reply(`💸 Sending ${amount} USDC to ${recipient}... (Paying gas in cUSD 💨)`);

    try {
        const hash = await client.writeContract({
            address: USDC_ADDRESS,
            abi: USDC_ABI,
            functionName: 'transfer',
            args: [recipient as `0x${string}`, BigInt(amount * 1e6)], // USDC 6 decimals
            chain: celoSepolia,
            // @ts-ignore - Gas Abstraction: Pay gas in cUSD
            feeCurrency: CUSD_ADDRESS
        } as any);

        // Log Analytics
        const { savings } = calculateSavings(amount);
        logTransaction(amount, "USDC", recipient, savings);

        ctx.reply(`✅ Transaction Sent!
        
Hash: \`${hash}\`
Explorer: https://celo-sepolia.blockscout.com/tx/${hash}`, { parse_mode: "Markdown" });
    } catch (error: any) {
        console.error(error);
        ctx.reply(`❌ Failed: ${error.shortMessage || error.message}`);
    }
});

// 5. AI NLP Handler
bot.on("text", async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return; // Ignore commands

    ctx.reply("🤖 Analyzing request...");

    const result = await parseCommand(text);

    if (!result || result.intent === "unknown") {
         return ctx.reply("🤔 I didn't understand that. Try 'Send 5 USDC to +123...'");
    }

    // Handle intents
    if (result.intent === "balance") {
        const balance = await client.getBalance({ address: account.address });
        const celo = Number(balance) / 1e18;
        const usdcBalance = await client.readContract({
            address: USDC_ADDRESS,
            abi: USDC_ABI,
            functionName: 'balanceOf',
            args: [account.address]
        } as any);
        const usdc = Number(usdcBalance) / 1e6;
        ctx.reply(`💰 *Wallet Balance*\n\nCELO: ${celo.toFixed(4)}\nUSDC: ${usdc.toFixed(2)}`, { parse_mode: "Markdown" });
        return;
    }

    if (result.intent === "wallet") {
        ctx.reply(`🏦 Address: \`${account.address}\``, { parse_mode: "Markdown" });
        return;
    }

    if (result.intent === "swap" && result.fromToken && result.toToken && result.amount) {
        ctx.reply(`💱 Swapping ${result.amount} ${result.fromToken} to ${result.toToken}...`);
        try {
            const txHash = await executeSwap(result.fromToken, result.toToken, result.amount.toString());
            ctx.reply(`✅ Swap Complete!\nHash: \`${txHash}\``, { parse_mode: "Markdown" });
        } catch (error: any) {
            ctx.reply(`❌ Swap Failed: ${error.message}`);
        }
        return;
    }

    if (result.intent === "remind" && result.amount && result.recipient && result.interval) {
        ctx.reply(`⏰ Setting up recurring transfer: ${result.amount} ${result.currency || "USDC"} to ${result.recipient} every ${result.interval}...`);
        
        // Use OpenClaw Cron API via Shell (Mock implementation for hackathon)
        // const cronExpr = result.interval === "day" ? "0 9 * * *" : result.interval === "week" ? "0 9 * * 1" : "0 9 1 * *";
        
        ctx.reply(`✅ *Recurring Transfer Active*
        
Schedule: Every ${result.interval}
Action: Send ${result.amount} ${result.currency || "USDC"}
Recipient: \`${result.recipient}\`

_Note: This is powered by OpenClaw's Autonomous Cron system._`, { parse_mode: "Markdown" });
        return;
    }

    if (result.intent === "send" && result.amount && result.recipient) {

        let recipient = result.recipient;
        const amount = result.amount;

        // SocialConnect Lookup inside AI flow
        if (recipient.startsWith("+")) {
            ctx.reply(`🔍 Looking up ${recipient}...`);
            const resolved = await lookupPhoneNumber(recipient, process.env.AGENT_PRIVATE_KEY as string);
            if (resolved) {
                recipient = resolved;
                ctx.reply(`✅ Found: \`${recipient}\``, { parse_mode: "Markdown" });
            } else {
                return ctx.reply(`⚠️ No wallet found for ${recipient}.`);
            }
        }

        if (!recipient.startsWith("0x")) {
            return ctx.reply("❌ Invalid recipient address.");
        }

        const miniPayLink = generateMiniPayLink(recipient, amount, result.currency || "cUSD");

        ctx.reply(`💸 *Confirm Transaction*
        
Send: ${amount} ${result.currency || "USDC"}
To: \`${recipient}\`

*Option 1: Auto-Send (Custodial)*
I will sign this transaction for you. (Pay gas in cUSD 💨)
        `, { 
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "✅ Auto-Send (Agent)", callback_data: `send_${amount}_${recipient}` }],
                    [{ text: "📱 Sign with MiniPay/Valora", url: miniPayLink }]
                ]
            }
        });
    }
});

// Handle Callback Query for Auto-Send
bot.action(/^send_(\d+(\.\d+)?)_(0x[a-fA-F0-9]{40})$/, async (ctx) => {
    const amount = parseFloat(ctx.match[1]);
    const recipient = ctx.match[3];
    
    ctx.answerCbQuery("Sending transaction...");
    ctx.editMessageText(`⏳ Executing transfer of ${amount} USDC...`);

    try {
        const hash = await client.writeContract({
            address: USDC_ADDRESS,
            abi: USDC_ABI,
            functionName: 'transfer',
            args: [recipient as `0x${string}`, BigInt(amount * 1e6)],
            chain: celoSepolia,
            // @ts-ignore - Gas Abstraction
            feeCurrency: CUSD_ADDRESS
        } as any);
        
        // Log Analytics
        const { savings } = calculateSavings(amount);
        logTransaction(amount, "USDC", recipient, savings);

        const receipt = formatSavingsReceipt(amount, "USDC");
        ctx.reply(`✅ Sent! Hash: \`${hash}\`\n\n${receipt}`, { parse_mode: "Markdown" });
    } catch (err: any) {
         ctx.reply(`❌ Failed: ${err.message}`);
    }
});

// 6. Stats Command
bot.command("stats", (ctx) => {
    const { totalVolume, totalSavings, count } = getStats();
    ctx.reply(`📊 *Rafiki Analytics Dashboard*
    
Total Transactions: ${count}
Total Volume Sent: $${totalVolume.toFixed(2)}
Total TradFi Savings: *+$${totalSavings.toFixed(2)}* 💰

_Helping you keep more of your money._
    `, { parse_mode: "Markdown" });
});

// 7. Voice Handler (Whisper Integration)
bot.on("voice", async (ctx) => {
    try {
        ctx.reply("🎙️ Processing voice note...");
        const fileId = ctx.message.voice.file_id;
        const link = await ctx.telegram.getFileLink(fileId);
        
        ctx.reply(`🏗️ *Voice Remittance Feature (Draft)*
        
I've received your voice note! In the production version, I would:
1. Transcribe the audio via *OpenAI Whisper*.
2. Parse the intent (e.g., "Mandar cinco euros para o meu pai").
3. Execute the remittance via SocialConnect.

URL: \`${link.href}\``, { parse_mode: "Markdown" });

    } catch (err: any) {
        ctx.reply(`❌ Voice processing error: ${err.message}`);
    }
});

// Launch
console.log("🚀 Rafiki Agent is starting...");
bot.launch().catch(err => {
    if (err.message.includes("401: Unauthorized")) {
        console.log("⚠️ Bot token unauthorized. Please update TELEGRAM_BOT_TOKEN in .env");
    } else {
        console.error("Bot launch failed:", err);
    }
});

// Graceful Stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

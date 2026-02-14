import { parseCommand } from "./ai-parser";

async function test() {
    console.log("Testing AI Parser...");
    const results = [
        "Send 10 USDC to +254700000000",
        "Remind me to send 5 cUSD to +123 every week",
        "Swap 10 CELO to cEUR"
    ];

    for (const r of results) {
        const res = await parseCommand(r);
        console.log(`Input: ${r}`);
        console.log(`Result: ${JSON.stringify(res, null, 2)}`);
    }
}

test();

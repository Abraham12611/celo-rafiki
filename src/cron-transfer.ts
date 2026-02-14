
import { createWalletClient, http, publicActions, parseUnits } from "viem";
import { celoSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";

dotenv.config();

const USDC_ADDRESS = (process.env.USDC_ADDRESS || "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B") as `0x${string}`;
const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369BC1" as `0x${string}`;

const USDC_ABI = [
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

async function run() {
    const privateKey = process.env.AGENT_PRIVATE_KEY as `0x${string}`;
    if (!privateKey) throw new Error("AGENT_PRIVATE_KEY missing");

    const recipient = process.argv[2] as `0x${string}`;
    const amount = parseFloat(process.argv[3]);
    const currency = process.argv[4] || "USDC";

    if (!recipient || !amount) {
        console.error("Usage: ts-node cron-transfer.ts <recipient> <amount> [currency]");
        process.exit(1);
    }

    const account = privateKeyToAccount(privateKey);
    const client = createWalletClient({
        account,
        chain: celoSepolia,
        transport: http(process.env.CELO_RPC_URL)
    }).extend(publicActions);

    console.log(`⏰ Executing recurring transfer: ${amount} ${currency} to ${recipient}`);

    try {
        const hash = await client.writeContract({
            address: currency === "USDC" ? USDC_ADDRESS : CUSD_ADDRESS,
            abi: USDC_ABI,
            functionName: 'transfer',
            args: [recipient, BigInt(amount * (currency === "USDC" ? 1e6 : 1e18))],
            chain: celoSepolia,
            // @ts-ignore
            feeCurrency: CUSD_ADDRESS
        } as any);

        console.log(`✅ Success! Hash: ${hash}`);
    } catch (error) {
        console.error(`❌ Failed:`, error);
        process.exit(1);
    }
}

run();

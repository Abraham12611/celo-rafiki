import { Mento } from "@mento-protocol/mento-sdk";
import { JsonRpcProvider, Wallet } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Ethers v6 Providers
const provider = new JsonRpcProvider(process.env.CELO_RPC_URL || "https://alfajores-forno.celo-testnet.org");
const wallet = new Wallet(process.env.AGENT_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000", provider);

let mento: Mento;

async function getMento() {
    if (!mento) {
        mento = await Mento.create({ provider });
    }
    return mento;
}

export async function executeSwap(fromToken: string, toToken: string, amountIn: string) {
    const fromAddress = getTokenAddress(fromToken);
    const toAddress = getTokenAddress(toToken);

    if (!fromAddress || !toAddress) {
        throw new Error(`Unsupported token pair: ${fromToken} to ${toToken}`);
    }

    console.log(`[Mento] Preparing swap: ${amountIn} ${fromToken} -> ${toToken}`);
    
    // In a production environment, we use the Mento Broker contract.
    // Address (Alfajores): 0xD3Dff18E465bCa6241A244144765b4421Ac14D09
    
    // For this MVP, we simulate the swap success to demonstrate the Agent flow.
    // Real implementation would involve:
    // 1. ERC20 Approve Broker
    // 2. Broker.swapIn(exchangeId, tokenIn, amountIn, minAmountOut, recipient)
    
    return "0x" + Math.random().toString(16).slice(2, 66); // Return a fake hash for demo
}

// Helper to map symbols to Celo Alfajores addresses
function getTokenAddress(symbol: string): string {
    const map: Record<string, string> = {
        "CELO": "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
        "cUSD": "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
        "cEUR": "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
        "cREAL": "0xE4D517785D091Ddd01D900f29E5f647e0538D8dB"
    };
    return map[symbol.toUpperCase()] || "";
}

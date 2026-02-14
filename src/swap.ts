import { Mento, Asset } from "@mento-protocol/mento-sdk";
import { JsonRpcProvider, Wallet } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Ethers v6 Providers
const provider = new JsonRpcProvider(process.env.CELO_RPC_URL || "https://alfajores-forno.celo-testnet.org");
const wallet = new Wallet(process.env.AGENT_PRIVATE_KEY || "", provider);

let mento: Mento;

async function getMento() {
    if (!mento) {
        mento = await Mento.create(provider);
    }
    return mento;
}

export async function getQuote(fromToken: string, toToken: string, amountIn: string) {
    try {
        const m = await getMento();
        
        // Find token addresses (simplified mapping for Hackathon)
        // In prod, use the SDK's asset discovery
        const fromAsset: Asset = { address: getTokenAddress(fromToken), symbol: fromToken, decimals: 18 }; 
        const toAsset: Asset = { address: getTokenAddress(toToken), symbol: toToken, decimals: 18 };

        // For MVP, we assume direct swaps or simple broker logic provided by SDK
        const amountInWei = BigInt(parseFloat(amountIn) * 1e18); // Basic logic, needs refinement for decimals
        
        const quote = await m.getQuote(fromAsset, toAsset, amountInWei);
        return quote;
    } catch (error) {
        console.error("Mento Quote Error:", error);
        return null;
    }
}

export async function executeSwap(fromToken: string, toToken: string, amountIn: string) {
    try {
        const m = await getMento();
        const fromAsset: Asset = { address: getTokenAddress(fromToken), symbol: fromToken, decimals: 18 }; 
        const toAsset: Asset = { address: getTokenAddress(toToken), symbol: toToken, decimals: 18 };
        
        const amountInWei = BigInt(parseFloat(amountIn) * 1e18);

        const txObj = await m.swapIn(fromAsset, toAsset, amountInWei);
        
        // Sign and send using the Ethers wallet
        const tx = await wallet.sendTransaction(txObj);
        return tx.hash;
    } catch (error) {
        console.error("Mento Swap Error:", error);
        throw error;
    }
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

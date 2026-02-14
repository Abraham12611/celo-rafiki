import * as dotenv from "dotenv";

dotenv.config();

// USDC Address on Celo Sepolia (Alfajores)
const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B"; 

export function generateMiniPayLink(recipient: string, amount: number, currency: string = "cUSD"): string {
    // MiniPay / Valora compatible deep link format
    // usually: celo://wallet/pay?address=<ADDR>&amount=<AMT>&currencyCode=<CURRENCY>
    
    // Note: MiniPay is widely compatible with the Celo standard URL scheme.
    // We map our "USDC" intent to the actual contract address if needed, 
    // but typically wallets support 'cUSD' or token addresses.
    
    let tokenParam = "";
    if (currency === "USDC") {
        tokenParam = `&token=${USDC_ADDRESS}`;
    } else {
        tokenParam = `&currencyCode=${currency}`; // cUSD, cEUR, cREAL
    }

    // Encoding parameters
    const params = new URLSearchParams({
        address: recipient,
        amount: amount.toString(),
        comment: "Sent via Rafiki AI"
    });

    // The generic Celo deep link
    return `celo://wallet/pay?${params.toString()}${tokenParam}`;
}

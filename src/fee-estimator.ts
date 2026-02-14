export function calculateSavings(amountUSD: number): { celoFee: number, tradFiFee: number, savings: number } {
    // Celo Gas is typically < $0.001
    const celoFee = 0.001; 

    // Traditional Remittance (e.g., Western Union/Wise) often 5-7% or fixed $5+
    // Model: $5 fixed + 2% spread
    const tradFiFee = 5.00 + (amountUSD * 0.02);

    return {
        celoFee,
        tradFiFee,
        savings: tradFiFee - celoFee
    };
}

export function formatSavingsReceipt(amount: number, currency: string): string {
    const { celoFee, tradFiFee, savings } = calculateSavings(amount);
    return `
🧾 *Savings Audit*
----------------
🏦 TradFi Fee: $${tradFiFee.toFixed(2)}
⚡ Celo Fee:   $${celoFee.toFixed(4)}
----------------
💰 *You Saved: $${savings.toFixed(2)}*
    `.trim();
}

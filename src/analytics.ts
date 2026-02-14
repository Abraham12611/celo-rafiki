import * as fs from "fs";
import * as path from "path";

const LOG_FILE = path.join(__dirname, "../transactions.json");

export interface Transaction {
    timestamp: number;
    amount: number;
    currency: string;
    recipient: string;
    savings: number;
}

export function logTransaction(amount: number, currency: string, recipient: string, savings: number) {
    let history: Transaction[] = [];
    if (fs.existsSync(LOG_FILE)) {
        try {
            history = JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
        } catch (e) {
            history = [];
        }
    }
    
    history.push({
        timestamp: Date.now(),
        amount,
        currency,
        recipient,
        savings
    });
    
    fs.writeFileSync(LOG_FILE, JSON.stringify(history, null, 2));
}

export function getStats() {
    if (!fs.existsSync(LOG_FILE)) return { totalVolume: 0, totalSavings: 0, count: 0 };
    
    const history: Transaction[] = JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
    const totalVolume = history.reduce((acc, tx) => acc + tx.amount, 0);
    const totalSavings = history.reduce((acc, tx) => acc + tx.savings, 0);
    
    return {
        totalVolume,
        totalSavings,
        count: history.length
    };
}

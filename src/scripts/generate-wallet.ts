import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

function generate() {
    console.log("🔐 Generating new agent wallet...");
    
    // Check if one already exists
    if (process.env.AGENT_PRIVATE_KEY) {
        console.log("⚠️  AGENT_PRIVATE_KEY already exists in .env. Skipping generation to prevent overwrite.");
        return;
    }

    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    console.log(`
    ✅ Wallet Generated!
    Address: ${account.address}
    Private Key: ${privateKey} (Saved to .env)
    `);

    // Append to .env
    const envPath = path.join(__dirname, "../../.env");
    fs.appendFileSync(envPath, `\nAGENT_PRIVATE_KEY=${privateKey}`);
    console.log("📄 Updated .env file.");
}

generate();

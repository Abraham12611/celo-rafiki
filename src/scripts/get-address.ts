import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.AGENT_PRIVATE_KEY as `0x${string}`;

if (!privateKey) {
  console.error("No private key found in .env");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);
console.log(`Wallet Address: ${account.address}`);

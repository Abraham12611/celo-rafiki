import { createPublicClient, http, formatEther } from 'viem';
import { celoAlfajores, sepolia, celoSepolia } from 'viem/chains'; // Added celoSepolia
import * as dotenv from 'dotenv';

dotenv.config();

const walletAddress = '0xc23A99dd10E4788F8Ac38425ac896920CBec2234';

async function checkBalances() {
  console.log(`Checking balances for: ${walletAddress}`);

  // 1. Check Celo Alfajores
  try {
    const clientAlfajores = createPublicClient({
      chain: celoAlfajores,
      transport: http()
    });
    const balanceAlfajores = await clientAlfajores.getBalance({ address: walletAddress });
    console.log(`Celo Alfajores Balance: ${formatEther(balanceAlfajores)} CELO`);
  } catch (e: any) {
    console.log("Failed to check Alfajores:", e.message);
  }

  // 2. Check Ethereum Sepolia
  try {
    const clientSepolia = createPublicClient({
      chain: sepolia,
      transport: http()
    });
    const balanceSepolia = await clientSepolia.getBalance({ address: walletAddress });
    console.log(`Ethereum Sepolia Balance: ${formatEther(balanceSepolia)} ETH`);
  } catch (e: any) {
    console.log("Failed to check Sepolia:", e.message);
  }

  // 3. Check Celo Sepolia (New L2?)
  try {
    const clientCeloSepolia = createPublicClient({
      chain: celoSepolia, // Use the new chain
      transport: http()
    });
    const balanceCeloSepolia = await clientCeloSepolia.getBalance({ address: walletAddress });
    console.log(`Celo Sepolia Balance: ${formatEther(balanceCeloSepolia)} CELO`);
  } catch (e: any) {
    console.log("Failed to check Celo Sepolia:", e.message);
  }
}

checkBalances();

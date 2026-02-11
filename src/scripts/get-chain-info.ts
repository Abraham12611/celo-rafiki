import { celoSepolia } from 'viem/chains';

console.log(`Chain Name: ${celoSepolia.name}`);
console.log(`Chain ID: ${celoSepolia.id}`);
console.log(`RPC URL: ${celoSepolia.rpcUrls.default.http[0]}`);

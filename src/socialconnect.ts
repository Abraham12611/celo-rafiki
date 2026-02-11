import { OdisUtils } from "@celo/identity";
import { AuthenticationMethod } from "@celo/identity/lib/odis/query";
import { ContractKit, newKit } from "@celo/contractkit";
import { Wallet } from "@celo/wallet-base";
import * as dotenv from 'dotenv';

dotenv.config();

const ODIS_URL = process.env.ODIS_URL || "https://odis-alfajores-staging.celo-testnet.org";
const ODIS_PUBKEY = process.env.ODIS_PUBKEY || "kPoRxWdEdZ/Nd3uQnp3FJFs54zuiS+ksqvOmI/GkPEMto8FRCgxX5uTk0pR9PFf/zqxf5c83YjdgkZAoUNiqSUS4EA15f0+NwHFxSwWnwiLnZ446peJgyZPjBZjAV5jc";

export async function lookupPhoneNumber(phoneNumber: string, privateKey: string): Promise<string | null> {
    try {
        // 1. Setup Kit
        const kit = newKit(process.env.CELO_RPC_URL || "https://alfajores-forno.celo-testnet.org");
        kit.addAccount(privateKey);
        const account = kit.web3.eth.accounts.privateKeyToAccount(privateKey).address;
        kit.defaultAccount = account;

        // 2. Auth for ODIS
        const authProvider = {
            async sign(message: string): Promise<string> {
                // @ts-ignore
                const signed = await kit.connection.sign(message, account);
                return signed.signature;
            }
        };

        // 3. Query ODIS for Pepper (Obfuscated Identifier)
        const { pepper } = await OdisUtils.PhoneNumberIdentifier.getPhoneNumberIdentifier(
            phoneNumber,
            account,
            authProvider,
            AuthenticationMethod.WALLET_KEY,
            undefined, // clientVersion
            ODIS_URL,
            ODIS_PUBKEY
        );

        // 4. Lookup Address in Attestations Contract
        const attestations = await kit.contracts.getAttestations();
        const identifier = OdisUtils.PhoneNumberIdentifier.getPhoneNumberIdentifierFromPepper(phoneNumber, pepper);
        
        // Check standard attestations
        const accounts = await attestations.lookupAccountsForIdentifier(identifier);
        
        if (accounts.length > 0) {
            return accounts[0];
        }

        return null;

    } catch (error) {
        console.error("SocialConnect Lookup Error:", error);
        return null;
    }
}

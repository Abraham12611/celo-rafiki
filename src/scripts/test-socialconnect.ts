import { lookupPhoneNumber } from "../socialconnect";
import * as dotenv from "dotenv";

dotenv.config();

async function test() {
    const phone = process.argv[2] || "+254700000000";
    const pk = process.env.AGENT_PRIVATE_KEY as string;
    
    console.log(`🔍 Testing SocialConnect for ${phone}...`);
    const address = await lookupPhoneNumber(phone, pk);
    
    if (address) {
        console.log(`✅ Success! Resolved to: ${address}`);
    } else {
        console.log(`❌ No address found or lookup failed.`);
    }
}

test();

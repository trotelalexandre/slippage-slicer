import dotenv from "dotenv";
import { ethers } from "ethers";
import { Address } from "viem";

dotenv.config();

export const PROVIDER = new ethers.JsonRpcProvider("https://polygon-rpc.com");
export const WALLET = new ethers.Wallet(process.env.PRIVATE_KEY!, PROVIDER); // private key

export const ROUTER_ADDRESS: Address =
  "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // router address
export const POOL_ADDRESS: Address =
  "0x360103Feb052aCDa1F09BDFB3D73a0C1B9662C78"; // pool address
export const QUOTER_ADDRESS: Address =
  "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"; // quoter address

export const BATCH_SIZE = ethers.parseUnits("10000", 18);
export const INTERVALS: number = 30000; // 30 seconds

export const LOG_FILE: string = "log.txt";
export const DEBUG_FILE: string = "debug.txt";

export const MAX_FEE_PER_GAS: number = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS: number = 100000000000;

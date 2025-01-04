import { Token } from "@uniswap/sdk-core";
import { WALLET, ROUTER_ADDRESS } from "../data/params.js";
import { Contract, ethers } from "ethers";
import { logToFile } from "./logToFile.js";

export async function approveTokenTransfer(token: Token) {
  const tokenContract: Contract = new ethers.Contract(
    token.address,
    ["function approve(address spender, uint256 amount)"],
    WALLET
  );

  const approval: ethers.TransactionResponse = await tokenContract.approve(
    ROUTER_ADDRESS,
    ethers.MaxUint256
  );

  logToFile(`Token approval: ${approval.hash}`);

  return approval;
}

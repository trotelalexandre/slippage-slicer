import { ethers } from "ethers";
import { polygon } from "viem/chains";
import { FeeAmount, Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { WALLET, POOL_ADDRESS } from "../data/params.js";
import { logToFile } from "./logToFile.js";
import IUniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json" assert { type: "json" };
import { Address } from "viem";

export async function getPoolInfo() {
  const poolContract = new ethers.Contract(
    POOL_ADDRESS,
    IUniswapV3Pool.abi,
    WALLET
  );

  const [token0Address, token1Address, feeAmount, liquidityAmount, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

  logToFile("Pool info fetched.");

  const sqrtPriceX96: bigint = slot0?.[0];
  const tick = Number(slot0?.[1]);
  const fee = Number(feeAmount);
  const liquidity: bigint = liquidityAmount;

  const token0: Token = new Token(polygon.id, token0Address, 18);
  const token1: Token = new Token(polygon.id, token1Address, 18);

  const pool = new Pool(
    token0, // WMATIC
    token1, // TROTEL
    fee,
    sqrtPriceX96.toString(),
    liquidity.toString(),
    tick
  );

  return {
    wmaticAddress: token0Address as Address,
    trotelAddress: token1Address as Address,
    fee,
    liquidity,
    sqrtPriceX96,
    tick,
    pool,
  };
}

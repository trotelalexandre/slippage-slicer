import { Route, Pool } from "@uniswap/v3-sdk";
import {
  BATCH_SIZE,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  ROUTER_ADDRESS,
  WALLET,
} from "../data/params.js";
import { logToFile } from "./logToFile.js";
import { getOutputQuote } from "./getOutputQuote.js";
import { Percent, Token } from "@uniswap/sdk-core";
import { Address } from "viem";
import { Interface } from "@ethersproject/abi";

export async function executeSwap({ pool }: { pool: Pool }) {
  const swapRoute: Route<Token, Token> = new Route(
    [pool],
    pool.token1,
    pool.token0
  );

  const amountOut = await getOutputQuote({
    swapRoute,
    tokenInAddress: pool.token1.address as Address,
  });

  logToFile(`Amount out: ${amountOut}`);

  const slippageTolerance: Percent = new Percent(50, 10_000); // 0.5% slippage tolerance
  const deadline: number = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

  const abi = [
    "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256)",
  ];
  const iface = new Interface(abi);

  const slippageNumerator = BigInt(
    Math.round(10_000 - parseFloat(slippageTolerance.toSignificant()) * 10_000)
  );
  const slippageDenominator = BigInt(10_000);

  const amountOutMinimum = BigInt(
    (amountOut * slippageNumerator) / slippageDenominator
  );

  logToFile(`Amount out minimum: ${amountOutMinimum}`);

  const params = {
    tokenIn: pool.token1.address,
    tokenOut: pool.token0.address,
    fee: pool.fee,
    recipient: WALLET.address,
    deadline,
    amountIn: BigInt(BATCH_SIZE),
    amountOutMinimum,
    sqrtPriceLimitX96: BigInt(0), // no limit on the price
  };

  const calldata = iface.encodeFunctionData("exactInputSingle", [params]);

  const tx = {
    data: calldata,
    to: ROUTER_ADDRESS,
    value: "0x0", // ETH value (0 since this swap does not involve ETH directly)
    from: WALLET.address,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  const res = await WALLET.sendTransaction(tx);

  logToFile(`Transaction hash: ${res.hash}`);
}

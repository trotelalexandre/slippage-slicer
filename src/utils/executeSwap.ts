import { Route, Trade, SwapRouter, Pool, SwapOptions } from "@uniswap/v3-sdk";
import {
  BATCH_SIZE,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  ROUTER_ADDRESS,
  WALLET,
} from "../data/params.js";
import { logToFile } from "./logToFile.js";
import { getOutputQuote } from "./getOutputQuote.js";
import { CurrencyAmount, TradeType, Percent, Token } from "@uniswap/sdk-core";
import { approveTokenTransfer } from "./approveTokenTransfer.js";
import { Address } from "viem";

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

  const currencyIn = CurrencyAmount.fromRawAmount(
    pool.token1,
    BATCH_SIZE.toString()
  );
  const currencyOut = CurrencyAmount.fromRawAmount(
    pool.token0,
    amountOut.toString()
  );

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: currencyIn,
    outputAmount: currencyOut,
    tradeType: TradeType.EXACT_INPUT,
  });

  const tokenApproval = await approveTokenTransfer(pool.token1);

  logToFile(`Token approval: ${tokenApproval.hash}`);

  const slippageTolerance: Percent = new Percent(50, 10_000); // 0.5%
  const deadline: number = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

  const options: SwapOptions = {
    slippageTolerance,
    deadline,
    recipient: WALLET.address,
  };

  const methodParameters = SwapRouter.swapCallParameters(
    [uncheckedTrade],
    options
  );

  const tx = {
    data: methodParameters.calldata,
    to: ROUTER_ADDRESS,
    vlaue: methodParameters.value,
    from: WALLET.address,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  logToFile(`Transaction data: ${tx.data}`);

  const res = await WALLET.sendTransaction(tx);

  logToFile(`Transaction hash: ${res.hash}`);
}

import { Route, SwapQuoter } from "@uniswap/v3-sdk";
import { CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";
import { BATCH_SIZE, PROVIDER, QUOTER_ADDRESS } from "../data/params.js";
import { polygon } from "viem/chains";
import { ethers } from "ethers";
import { Address } from "viem";

export async function getOutputQuote({
  swapRoute,
  tokenInAddress,
}: {
  swapRoute: Route<Token, Token>;
  tokenInAddress: Address;
}) {
  const tokenIn: Token = new Token(polygon.id, tokenInAddress, 18);

  const { calldata } = SwapQuoter.quoteCallParameters(
    swapRoute,
    CurrencyAmount.fromRawAmount(tokenIn, BATCH_SIZE.toString()),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  );

  const quoteCallReturnData = await PROVIDER.call({
    to: QUOTER_ADDRESS,
    data: calldata,
  });

  const resultArray: ethers.Result = ethers.AbiCoder.defaultAbiCoder().decode(
    ["uint256"],
    quoteCallReturnData
  );

  const amountOut: bigint = resultArray[0];

  return amountOut;
}

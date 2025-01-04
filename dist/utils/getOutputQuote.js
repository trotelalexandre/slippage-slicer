var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SwapQuoter } from "@uniswap/v3-sdk";
import { CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";
import { BATCH_SIZE, PROVIDER, QUOTER_ADDRESS } from "../data/params.js";
import { polygon } from "viem/chains";
import { ethers } from "ethers";
export function getOutputQuote(_a) {
    return __awaiter(this, arguments, void 0, function* ({ swapRoute, tokenInAddress, }) {
        const tokenIn = new Token(polygon.id, tokenInAddress, 18);
        const { calldata } = SwapQuoter.quoteCallParameters(swapRoute, CurrencyAmount.fromRawAmount(tokenIn, BATCH_SIZE.toString()), TradeType.EXACT_INPUT, {
            useQuoterV2: true,
        });
        const quoteCallReturnData = yield PROVIDER.call({
            to: QUOTER_ADDRESS,
            data: calldata,
        });
        const resultArray = ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], quoteCallReturnData);
        const amountOut = resultArray[0];
        return amountOut;
    });
}

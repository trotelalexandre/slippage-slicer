var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Route, Trade, SwapRouter } from "@uniswap/v3-sdk";
import { BATCH_SIZE, MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS, ROUTER_ADDRESS, WALLET, } from "../data/params.js";
import { logToFile } from "./logToFile.js";
import { getOutputQuote } from "./getOutputQuote.js";
import { CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { approveTokenTransfer } from "./approveTokenTransfer.js";
export function executeSwap(_a) {
    return __awaiter(this, arguments, void 0, function* ({ pool }) {
        const swapRoute = new Route([pool], pool.token1, pool.token0);
        const amountOut = yield getOutputQuote({
            swapRoute,
            tokenInAddress: pool.token1.address,
        });
        logToFile(`Amount out: ${amountOut}`);
        const currencyIn = CurrencyAmount.fromRawAmount(pool.token1, BATCH_SIZE.toString());
        const currencyOut = CurrencyAmount.fromRawAmount(pool.token0, amountOut.toString());
        const uncheckedTrade = Trade.createUncheckedTrade({
            route: swapRoute,
            inputAmount: currencyIn,
            outputAmount: currencyOut,
            tradeType: TradeType.EXACT_INPUT,
        });
        const tokenApproval = yield approveTokenTransfer(pool.token1);
        logToFile(`Token approval: ${tokenApproval.hash}`);
        const slippageTolerance = new Percent(50, 10000); // 0.5%
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
        const options = {
            slippageTolerance,
            deadline,
            recipient: WALLET.address,
        };
        const methodParameters = SwapRouter.swapCallParameters([uncheckedTrade], options);
        const tx = {
            data: methodParameters.calldata,
            to: ROUTER_ADDRESS,
            vlaue: methodParameters.value,
            from: WALLET.address,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        };
        logToFile(`Transaction data: ${tx.data}`);
        const res = yield WALLET.sendTransaction(tx);
        logToFile(`Transaction hash: ${res.hash}`);
    });
}

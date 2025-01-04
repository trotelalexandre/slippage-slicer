var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Route } from "@uniswap/v3-sdk";
import { BATCH_SIZE, MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS, ROUTER_ADDRESS, WALLET, } from "../data/params.js";
import { logToFile } from "./logToFile.js";
import { getOutputQuote } from "./getOutputQuote.js";
import { Percent } from "@uniswap/sdk-core";
import { approveTokenTransfer } from "./approveTokenTransfer.js";
import { Interface } from "@ethersproject/abi";
export function executeSwap(_a) {
    return __awaiter(this, arguments, void 0, function* ({ pool }) {
        const swapRoute = new Route([pool], pool.token1, pool.token0);
        const amountOut = yield getOutputQuote({
            swapRoute,
            tokenInAddress: pool.token1.address,
        });
        logToFile(`Amount out: ${amountOut}`);
        const tokenApproval = yield approveTokenTransfer(pool.token1);
        logToFile(`Token approval: ${tokenApproval.hash}`);
        const slippageTolerance = new Percent(50, 10000); // 0.5% slippage tolerance
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
        const abi = [
            "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256)",
        ];
        const iface = new Interface(abi);
        const slippageNumerator = BigInt(Math.round(10000 - parseFloat(slippageTolerance.toSignificant()) * 10000));
        const slippageDenominator = BigInt(10000);
        const amountOutMinimum = BigInt((amountOut * slippageNumerator) / slippageDenominator);
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
        const res = yield WALLET.sendTransaction(tx);
        logToFile(`Transaction hash: ${res.hash}`);
    });
}

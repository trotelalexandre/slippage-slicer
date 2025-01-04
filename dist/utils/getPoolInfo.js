var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from "ethers";
import { polygon } from "viem/chains";
import { Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { WALLET, POOL_ADDRESS } from "../data/params.js";
import { logToFile } from "./logToFile.js";
import IUniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json" assert { type: "json" };
export function getPoolInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const poolContract = new ethers.Contract(POOL_ADDRESS, IUniswapV3Pool.abi, WALLET);
        const [token0Address, token1Address, feeAmount, liquidityAmount, slot0] = yield Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.liquidity(),
            poolContract.slot0(),
        ]);
        logToFile("Pool info fetched.");
        const sqrtPriceX96 = slot0 === null || slot0 === void 0 ? void 0 : slot0[0];
        const tick = Number(slot0 === null || slot0 === void 0 ? void 0 : slot0[1]);
        const fee = Number(feeAmount);
        const liquidity = liquidityAmount;
        const token0 = new Token(polygon.id, token0Address, 18);
        const token1 = new Token(polygon.id, token1Address, 18);
        const pool = new Pool(token0, // WMATIC
        token1, // TROTEL
        fee, sqrtPriceX96.toString(), liquidity.toString(), tick);
        return {
            wmaticAddress: token0Address,
            trotelAddress: token1Address,
            fee,
            liquidity,
            sqrtPriceX96,
            tick,
            pool,
        };
    });
}

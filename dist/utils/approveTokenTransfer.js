var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WALLET, ROUTER_ADDRESS } from "../data/params.js";
import { ethers } from "ethers";
import { logToFile } from "./logToFile.js";
export function approveTokenTransfer(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenContract = new ethers.Contract(token.address, ["function approve(address spender, uint256 amount)"], WALLET);
        const approval = yield tokenContract.approve(ROUTER_ADDRESS, ethers.MaxUint256);
        logToFile(`Token approval: ${approval.hash}`);
        return approval;
    });
}

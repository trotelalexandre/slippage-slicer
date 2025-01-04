var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPoolInfo } from "./utils/getPoolInfo.js";
import { executeSwap } from "./utils/executeSwap.js";
import { INTERVALS } from "./data/params.js";
import { clearLogFile } from "./utils/clearLogFile.js";
import { clearDebugFile } from "./utils/clearDebugFile.js";
function clearAllLogs() {
    clearLogFile();
    clearDebugFile();
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        clearAllLogs();
        const poolInfo = yield getPoolInfo();
        const { pool } = poolInfo;
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            yield executeSwap({ pool });
        }), INTERVALS);
    }
    catch (error) {
        console.error("Error in the swap process:", error);
    }
}))();

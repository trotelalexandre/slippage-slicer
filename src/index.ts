import { getPoolInfo } from "./utils/getPoolInfo.js";
import { executeSwap } from "./utils/executeSwap.js";
import { INTERVALS } from "./data/params.js";
import { clearLogFile } from "./utils/clearLogFile.js";
import { clearDebugFile } from "./utils/clearDebugFile.js";
import { approveTokenTransfer } from "./utils/approveTokenTransfer.js";

function clearAllLogs() {
  clearLogFile();
  clearDebugFile();
}

(async () => {
  try {
    clearAllLogs();

    const poolInfo = await getPoolInfo();
    const { pool } = poolInfo;

    const tokenApproval = await approveTokenTransfer(pool.token1);

    setInterval(async () => {
      await executeSwap({ pool });
    }, INTERVALS);
  } catch (error) {
    console.error("Error in the swap process:", error);
  }
})();

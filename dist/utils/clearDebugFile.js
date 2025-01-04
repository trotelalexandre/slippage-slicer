import fs from "fs";
import { DEBUG_FILE } from "../data/params.js";
export function clearDebugFile() {
    fs.writeFileSync(DEBUG_FILE, "");
    console.log("Debug file cleared.");
}

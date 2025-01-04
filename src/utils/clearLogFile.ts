import fs from "fs";
import { LOG_FILE } from "../data/params.js";

export function clearLogFile() {
  fs.writeFileSync(LOG_FILE, "");
  console.log("Log file cleared.");
}

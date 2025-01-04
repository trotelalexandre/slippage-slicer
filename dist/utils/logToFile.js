import fs from "fs";
import { LOG_FILE } from "../data/params.js";
export function logToFile(message) {
    fs.appendFileSync(LOG_FILE, `${new Date().toISOString()} - ${message}\n`);
    console.log(`${new Date().toISOString()} - ${message}`);
}

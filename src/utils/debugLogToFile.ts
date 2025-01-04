import fs from "fs";
import util from "util";
import { DEBUG_FILE } from "../data/params.js";

export function debugLogToFile(object: any) {
  const fullObjectString = util.inspect(object, { depth: null, colors: false });

  fs.appendFileSync(
    DEBUG_FILE,
    `${new Date().toISOString()} - ${fullObjectString}\n`
  );
}

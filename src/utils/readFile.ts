import { checkFileExists } from "./checkFileExists.js";
import fs from "fs/promises";

export async function readFile(path: string) {
  try {
    await checkFileExists(path);
    const read = await fs.readFile(path, "utf-8");
    return JSON.parse(read);
  } catch (e: any) {
    throw new Error(e);
  }
}

import fs from "fs/promises";

export async function writeFile(path: string, data: object) {
  try {
    await fs.writeFile(path, JSON.stringify(data), "utf-8");
    return true;
  } catch (e: any) {
    throw new Error(e);
  }
}

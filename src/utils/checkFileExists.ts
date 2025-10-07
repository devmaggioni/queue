import fs from "fs/promises";

export async function checkFileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch (e: any) {
    if (e?.syscall === "access") {
      await fs.writeFile(path, "[]");
      return true;
    }
    throw new Error(e);
  }
}

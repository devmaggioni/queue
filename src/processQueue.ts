import { FnQueue } from "./entities/fnQueue.js";
import { Queue } from "./entities/Queue.js";

// Para FnQueue
export async function processQueue<T>(
  q: FnQueue,
  fn: (data: T) => any
): Promise<void>;

// Para Queue
export async function processQueue<T>(
  q: Queue,
  fn: (data: { taskId: string; task: T }) => any
): Promise<void>;

export async function processQueue<T>(
  q: FnQueue | Queue,
  fn: (data: any) => any
) {
  if (q instanceof FnQueue) {
    for (const data of await q.runAll()) {
      await fn(data);
    }
    await q.clear();
  } else if (q instanceof Queue) {
    for await (const data of await q.runAsync()) {
      await fn(data);
    }
    await q.clear();
  }
}

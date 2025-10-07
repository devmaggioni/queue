import { readFile } from "../utils/readFile.js";
import { writeFile } from "../utils/writeFile.js";

type Task<T> = { taskId: string; task: T };

export class Queue<T = any> {
  private list: Map<string, T> = new Map();
  private path?: string;
  private loaded: boolean = false;
  private options: { delay?: number | null } | undefined;

  constructor(options?: { delay?: number | null }) {
    this.options = options;
  }

  // Carrega tarefas do arquivo
  async load(path: string) {
    try {
      const arr: Task<T>[] = await readFile(path);
      this.list = new Map(arr.map((item) => [item.taskId, item.task]));
      this.path = path;
      this.loaded = true;
      return this.list;
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error(String(e));
    }
  }

  // Adiciona uma tarefa
  async add(item: [string, T]) {
    const [taskId, task] = item;
    if (this.list.has(taskId)) return false;

    this.list.set(taskId, task);

    if (this.loaded && this.path) {
      try {
        const arr: Task<T>[] = await readFile(this.path);
        arr.push({ taskId, task });
        await writeFile(this.path, arr);
      } catch (e) {
        if (e instanceof Error) throw e;
        throw new Error(String(e));
      }
    }

    return true;
  }

  // Remove uma tarefa pelo ID
  async del(taskId: string) {
    if (!this.list.has(taskId)) return false;

    this.list.delete(taskId);

    if (this.loaded && this.path) {
      try {
        const arr: Task<T>[] = await readFile(this.path);
        const index = arr.findIndex((item) => item.taskId === taskId);
        if (index !== -1) arr.splice(index, 1);
        await writeFile(this.path, arr);
      } catch (e) {
        if (e instanceof Error) throw e;
        throw new Error(String(e));
      }
    }

    return true;
  }

  // Limpa todas as tarefas
  async clear() {
    this.list.clear();
    if (this.loaded && this.path) {
      await writeFile(this.path, []);
    }
  }

  // Obtém uma tarefa pelo ID
  get(taskId: string) {
    return this.list.get(taskId);
  }

  // Obtém todas as tarefas
  getAll() {
    return this.list;
  }

  // Pega a próxima tarefa (FIFO)
  async next(): Promise<T | false> {
    const firstKey = this.list.keys().next().value;
    if (!firstKey) return false;

    const value = this.list.get(firstKey)!;
    this.list.delete(firstKey);

    if (this.loaded && this.path) {
      try {
        const arr: Task<T>[] = await readFile(this.path);
        const index = arr.findIndex((item) => item.taskId === firstKey);
        if (index !== -1) arr.splice(index, 1);
        await writeFile(this.path, arr);
      } catch (e) {
        if (e instanceof Error) throw e;
        throw new Error(String(e));
      }
    }

    return value;
  }

  // Iterador síncrono
  *run() {
    for (const [taskId, task] of this.list) {
      yield { taskId, task };
    }
  }

  // Iterador assíncrono com delay opcional
  async *runAsync() {
    for (const [taskId, task] of this.list) {
      if (this.options?.delay) {
        await new Promise((r) => setTimeout(r, this.options!.delay!));
      }
      yield { taskId, task };
    }
  }
}

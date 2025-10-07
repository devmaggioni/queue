export class FnQueue<T = any> {
  #list: Map<string, () => Promise<T>> = new Map();
  options: { delay?: number | null } | undefined;
  #running: boolean = false;

  constructor(options?: { delay?: number | null }) {
    this.options = options;
  }

  // Adiciona uma função à fila
  add(item: [string, Function]) {
    const [taskId, task] = item;
    if (this.#list.has(taskId)) return false;

    // Envolve a função para sempre retornar Promise
    const asyncTask = async () => {
      return task();
    };

    this.#list.set(taskId, asyncTask);
    return true;
  }

  // Remove uma função da fila
  del(taskId: string) {
    if (!this.#list.has(taskId)) return false;
    this.#list.delete(taskId);
    return true;
  }

  // Limpa todas as funções
  clear() {
    this.#list.clear();
  }

  // Obtém uma função pelo ID
  get(taskId: string) {
    return this.#list.get(taskId);
  }

  // Obtém todas as funções
  get list() {
    return this.#list;
  }

  // Executa a próxima função da fila (FIFO)
  async next(): Promise<T | false> {
    const firstKey = this.#list.keys().next().value;
    if (!firstKey) return false;

    const fn = this.#list.get(firstKey)!;
    this.#list.delete(firstKey);
    const result = await fn();
    if (this.options?.delay) {
      await new Promise((r) => setTimeout(r, this.options!.delay!));
    }
    return result;
  }

  // Executa todas as funções na fila, uma após a outra
  async runAll(): Promise<T[]> {
    if (this.#running) throw new Error("Fila já está em execução");
    this.#running = true;
    const results: T[] = [];

    while (this.#list.size > 0) {
      const result = await this.next();
      if (result !== false) results.push(result);
    }

    this.#running = false;
    return results;
  }
}

# 🗂 QUEUE

Uma implementação completa de **filas em TypeScript**:

- `Queue`: fila de **tarefas genérica**, persistente em arquivo, com suporte a iteradores síncronos e assíncronos.
- `FnQueue`: fila de **funções assíncronas em memória**, executando uma função por vez (FIFO), com delay opcional.

---

## 📦 Instalação

```bash
npm install @devmaggioni/queue
# ou
yarn add @devmaggioni/queue
```

---

## 📝 Queue

### Descrição

Fila de tarefas genérica, com persistência opcional em arquivo JSON.
Permite adicionar, remover, limpar, iterar e executar tarefas com delay opcional.

### Tipagem

```ts
type Task<T> = { taskId: string; task: T };
```

### Construtor

```ts
const queue = new Queue<string>({ delay: 500 });
```

- `options.delay`: Delay em milissegundos entre execuções no `runAsync`. Opcional.

### Métodos

| Método                | Descrição                                                                  |
| --------------------- | -------------------------------------------------------------------------- |
| `load(path: string)`  | Carrega tarefas de um arquivo JSON. Retorna `Map<string, T>`.              |
| `add([taskId, task])` | Adiciona uma tarefa. Retorna `true` se adicionada, `false` se já existir.  |
| `del(taskId)`         | Remove tarefa pelo ID. Retorna `true` se removida, `false` caso contrário. |
| `clear()`             | Remove todas as tarefas.                                                   |
| `get(taskId)`         | Retorna a tarefa pelo ID.                                                  |
| `getAll()`            | Retorna todas as tarefas.                                                  |
| `next()`              | Retorna e remove a próxima tarefa (FIFO). Retorna `false` se vazio.        |
| `run()`               | Iterador síncrono sobre todas as tarefas.                                  |
| `runAsync()`          | Iterador assíncrono com delay opcional.                                    |

### Exemplo de uso

```ts
import { Queue } from "@devmaggioni/queue";

async function main() {
  const queue = new Queue<string>({ delay: 100 });

  await queue.add(["task1", "Enviar email"]);
  await queue.add(["task2", "Processar pedido"]);

  for await (const { taskId, task } of queue.runAsync()) {
    console.log(taskId, task);
  }

  const nextTask = await queue.next();
  console.log("Próxima tarefa:", nextTask);
}

main();
```

---

## 🏃 FnQueue

### Descrição

Fila de funções assíncronas **em memória**, executando **uma de cada vez** (FIFO).
Funções síncronas são automaticamente convertidas em assíncronas. Delay opcional entre execuções.

### Construtor

```ts
const fnQueue = new FnQueue<number>({ delay: 500 });
```

- `options.delay`: Delay entre execuções em milissegundos. Opcional.

### Métodos

| Método              | Descrição                                                                          |
| ------------------- | ---------------------------------------------------------------------------------- |
| `add([taskId, fn])` | Adiciona uma função à fila. Retorna `true` se adicionada, `false` se já existir.   |
| `del(taskId)`       | Remove função pelo ID. Retorna `true` se removida, `false` caso contrário.         |
| `clear()`           | Limpa todas as funções.                                                            |
| `get(taskId)`       | Retorna função pelo ID.                                                            |
| `getAll()`          | Retorna todas as funções da fila.                                                  |
| `next()`            | Executa e remove a próxima função (FIFO). Retorna o resultado ou `false` se vazio. |
| `runAll()`          | Executa **todas** as funções na fila em sequência. Retorna array com resultados.   |

### Exemplo de uso

```ts
import { FnQueue } from "@devmaggioni/queue";

async function main() {
  const queue = new FnQueue<number>({ delay: 300 });

  queue.add(["task1", () => 1]);
  queue.add([
    "task2",
    async () => {
      await new Promise((r) => setTimeout(r, 200));
      return 2;
    },
  ]);

  const results = await queue.runAll();
  console.log("Resultados:", results); // [1, 2]
}

main();
```

---

## ⚡ Características

- FIFO garantido em ambas as filas
- Delay opcional entre execuções
- Iteradores síncronos e assíncronos (`Queue`)
- Execução em sequência de funções (`FnQueue`)
- Tipagem genérica com TypeScript
- Persistência opcional em arquivo (`Queue`)
- Todas funções do `FnQueue` são convertidas em assíncronas automaticamente

---

## 💡 Dicas

- Para `Queue`, prefira **FIFO** para processamento em ordem de chegada.
- Para `FnQueue`, **não use funções com efeitos colaterais não tratados** dentro da fila sem await.
- Use `options.delay` para simular processamento lento ou evitar sobrecarga de tarefas.

---

## 📄 Licença

MIT License.

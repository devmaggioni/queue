# 🚀 @devmaggioni/queue

Uma biblioteca TypeScript elegante e eficiente para gerenciamento de filas, com suporte para persistência em disco e execução de funções assíncronas.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Características

- 🎯 **Duas implementações de fila**: `Queue` para dados e `FnQueue` para funções
- 💾 **Persistência opcional**: Salve e carregue filas do disco
- ⏱️ **Delay configurável**: Controle o tempo entre execuções
- 🔄 **FIFO (First In, First Out)**: Ordem garantida de processamento
- 🎭 **TypeScript nativo**: Tipagem completa e type-safe
- 🚦 **Iteradores síncronos e assíncronos**: Flexibilidade no processamento

## 📦 Instalação

```bash
npm install @devmaggioni/queue
```

```bash
yarn add @devmaggioni/queue
```

```bash
pnpm add @devmaggioni/queue
```

## 🎓 Uso

### FnQueue - Fila de Funções

Ideal para executar funções assíncronas em sequência:

```typescript
import { FnQueue, processQueue } from "@devmaggioni/queue";

// Criar fila com delay opcional de 1 segundo
const fnQueue = new FnQueue({ delay: 1000 });

// Adicionar funções à fila
fnQueue.add([
  "task1",
  async () => {
    console.log("Executando tarefa 1");
    return { resultado: "sucesso" };
  },
]);

fnQueue.add([
  "task2",
  async () => {
    console.log("Executando tarefa 2");
    return { resultado: "completo" };
  },
]);

// Executar todas as funções
const resultados = await fnQueue.runAll();
console.log(resultados);

// Ou processar uma por uma
while (fnQueue.list.size > 0) {
  const resultado = await fnQueue.next();
  console.log(resultado);
}
```

### Queue - Fila de Dados com Persistência

Perfeita para gerenciar tarefas com persistência em disco:

```typescript
import { Queue, processQueue } from "@devmaggioni/queue";

interface MinhaTask {
  nome: string;
  dados: any;
}

// Criar fila
const queue = new Queue<MinhaTask>({ delay: 500 });

// Carregar tarefas existentes do disco
await queue.load("./tasks.json");

// Adicionar novas tarefas
await queue.add([
  "task1",
  {
    nome: "Processar pedido",
    dados: { pedidoId: 123 },
  },
]);

await queue.add([
  "task2",
  {
    nome: "Enviar email",
    dados: { destinatario: "user@example.com" },
  },
]);

// Processar com iterador assíncrono
for await (const { taskId, task } of queue.runAsync()) {
  console.log(`Processando ${taskId}:`, task);
  // Seu processamento aqui
}

// Limpar fila
await queue.clear();
```

### Função Helper: processQueue

Simplifique o processamento com a função helper:

```typescript
import { Queue, FnQueue, processQueue } from "@devmaggioni/queue";

// Com FnQueue
const fnQueue = new FnQueue();
fnQueue.add(["task1", async () => ({ data: "resultado" })]);

await processQueue(fnQueue, (resultado) => {
  console.log("Resultado:", resultado);
});

// Com Queue
const queue = new Queue();
await queue.add(["task1", { info: "dados" }]);

await processQueue(queue, ({ taskId, task }) => {
  console.log(`Task ${taskId}:`, task);
});
```

## 📚 API Reference

### FnQueue

#### Constructor

```typescript
new FnQueue<T>(options?: { delay?: number | null })
```

#### Métodos

- `add(item: [string, Function]): boolean` - Adiciona função à fila
- `del(taskId: string): boolean` - Remove função pelo ID
- `clear(): void` - Limpa todas as funções
- `get(taskId: string): Function | undefined` - Obtém função pelo ID
- `next(): Promise<T | false>` - Executa próxima função
- `runAll(): Promise<T[]>` - Executa todas as funções sequencialmente

#### Propriedades

- `list: Map<string, Function>` - Mapa de funções na fila

### Queue

#### Constructor

```typescript
new Queue<T>(options?: { delay?: number | null })
```

#### Métodos

- `load(path: string): Promise<Map<string, T>>` - Carrega fila do disco
- `add(item: [string, T]): Promise<boolean>` - Adiciona tarefa
- `del(taskId: string): Promise<boolean>` - Remove tarefa
- `clear(): Promise<void>` - Limpa todas as tarefas
- `get(taskId: string): T | undefined` - Obtém tarefa pelo ID
- `next(): Promise<T | false>` - Obtém próxima tarefa
- `run(): Generator` - Iterador síncrono
- `runAsync(): AsyncGenerator` - Iterador assíncrono com delay

#### Propriedades

- `list: Map<string, T>` - Mapa de tarefas na fila

### processQueue

```typescript
// Para FnQueue
processQueue<T>(q: FnQueue, fn: (data: T) => any): Promise<void>

// Para Queue
processQueue<T>(q: Queue, fn: (data: { taskId: string; task: T }) => any): Promise<void>
```

## 🎯 Casos de Uso

- ✅ Processamento sequencial de tarefas
- ✅ Gerenciamento de jobs assíncronos
- ✅ Rate limiting de requisições API
- ✅ Processamento em lote com delay
- ✅ Sistema de tarefas persistentes

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

MIT © [devmaggioni](https://github.com/devmaggioni)

## 👤 Autor

**devmaggioni**

- GitHub: [@devmaggioni](https://github.com/devmaggioni)

---

Feito com ❤️ por devmaggioni

import { FnQueue } from "./entities/fnQueue.js";
import { Queue } from "./entities/Queue.js";
import { processQueue } from "./processQueue.js";

const queue1 = new Queue();

const names = ["Gabriel", "Pedro", "Roberto", "Maiara"];
for (const [index, name] of names.entries()) {
  queue1.add([`task${index}`, { name }]);
}

await processQueue(queue1, (data) => console.log("processQueue: ", data));
console.log("list as clean before process: ", queue1.list);
// or...
// for (const data of queue1.run()) {
//   console.log("for loop: ", data);
// }

const queue2 = new FnQueue({
  delay: 1000,
});

queue2.add(["task1", () => console.log("do something with .next()")]);
queue2.add(["task2", () => "do another something"]);
queue2.add(["task3", () => "do more something"]);
console.log("get: ", queue2.get("task2"));
queue2.next();

await processQueue(queue2, (data) => console.log("fn queue: ", data));

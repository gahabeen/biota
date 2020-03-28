// types
import { Task, TaskExecuteOptions } from "~/../types/task";

export async function execute(
  tasks: Task[],
  options?: TaskExecuteOptions
): Promise<any[]> {
  let { indent = 0 } = options || {};
  let indentation = "--".repeat(indent);
  let ctx = {};
  let results = [];
  for (let task of tasks) {
    console.log(`${indentation}[t] ${task.name}`);
    await new Promise((resolve, reject) =>
      task
        .task(ctx)
        .then(resolve)
        .catch(reject)
    )
      .then(res => results.push(res))
      .catch(error => {
        results.push({ error });
        console.error(`${indentation}[t] error: ${task.name}: ${error.message}`);
        if (task.fullError) {
          try {
            console.error(
              JSON.stringify(
                JSON.parse(error.requestResult.responseRaw),
                null,
                2
              )
            );
          } catch (e) {
            console.error(error);
          }
        }
      });
  }
  return results;
}

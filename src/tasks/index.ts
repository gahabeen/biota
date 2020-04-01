import Debug from "debug";
import { Task, TaskExecuteOptions } from "~/../types/task";

export async function execute(tasks: Task[], options?: TaskExecuteOptions): Promise<any | any[]> {
  let { indent = 0, singleResult = false, domain = "task" } = options || {};
  const debug = Debug("biota").extend(domain);
  let indentation = "--".repeat(indent);
  let ctx = {};
  let results = [];
  for (let task of tasks) {
    debug(`${indentation} ${task.name}`);
    await new Promise((resolve, reject) =>
      task
        .task(ctx)
        .then(resolve)
        .catch(reject)
    )
      .then(res => results.push(res))
      .catch(error => {
        results.push({ error });
        debug(`${indentation} error: ${task.name}: ${error.message}`);

        try {
          debug(JSON.stringify(JSON.parse(error.requestResult.responseRaw), null, 2));
        } catch (error) {
          debug(JSON.stringify(error, null, 2));
        }

        if (task.fullError) {
          try {
            debug(JSON.stringify(JSON.parse(error.requestResult.responseRaw), null, 2));
          } catch (e) {
            debug(error);
          }
        }
      });
  }
  if (singleResult) {
    try {
      return results[0];
    } catch (error) {
      return {};
    }
  }
  return results;
}
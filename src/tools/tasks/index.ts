import Debug from 'debug';
import { Task, TaskExecuteOptions } from '~/types/task';
// import * as fs from 'fs';
import { splitEvery } from '~/helpers';

export async function execute(tasks: Task[], options?: TaskExecuteOptions): Promise<any | any[]> {
  const { indent = 0, singleResult = true, domain = 'task', parallel = false, batchSize = 40 } = options || {};
  const debug = Debug('biota').extend(domain);
  const debugError = Debug('biota-error').extend(domain);
  const indentation = '--'.repeat(indent);
  const ctx = {};
  const results = [];
  for (const taskBatch of splitEvery(batchSize, tasks)) {
    const taskPromises = [];
    for (const task of taskBatch) {
      debug(`${indentation} ${task.name}`);
      const taskProm = () =>
        new Promise((resolve, reject) =>
          task
            .task(ctx, debug)
            .then((res: any) => {
              res = res || {
                res,
              };
              if (res.errors) {
                reject(res);
              } else {
                resolve(res);
              }
              return res;
            })
            .catch(reject),
        )
          .then((res) => results.push(res))
          .catch((error) => {
            results.push({ error });
            debugError(`${indentation} error: ${task.name}: ${error.message}`);

            try {
              // if (process.env.SAVE_LOG) {
              // fs.appendFileSync('./erros.txt', domain);
              // fs.appendFileSync('./erros.txt', JSON.stringify(JSON.parse(error.requestResult.responseRaw), null, 2));
              // }
              debugError(JSON.stringify(JSON.parse(error.requestResult.responseRaw), null, 2));
            } catch (error) {
              // if (process.env.SAVE_LOG) {
              //   fs.appendFileSync('./erros.txt', domain);
              //   fs.appendFileSync('./erros.txt', JSON.stringify(error, null, 2));
              // }
              debugError(JSON.stringify(error, null, 2));
            }

            if (task.fullError) {
              try {
                debugError(JSON.stringify(JSON.parse(error.requestResult.responseRaw), null, 2));
              } catch (e) {
                debugError(JSON.stringify(error, null, 2));
              }
            }
          });
      if (parallel) {
        taskPromises.push(taskProm());
      } else {
        await taskProm();
      }
    }
    if (parallel) {
      await Promise.all(taskPromises);
    }
  }

  if (singleResult) {
    try {
      return results[results.length - 1];
    } catch (error) {
      return {};
    }
  }
  return results;
}

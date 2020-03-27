// types
import { DB } from "~/db";
// biota
import { execute } from "~/tasks";
import * as defaultFunctions from "~/framework/api/default/functions";
import { upsert } from "~/factory/api/upsert";

export function foundation(this: DB) {
  const self = this;
  let tasks = [];
  for (let UDFunction of Object.values(defaultFunctions)) {
    tasks.push({
      name: `Upserting function: ${UDFunction.name}`,
      task() {
        return self.query(upsert.function(UDFunction));
      }
    });
  }

  return execute(tasks);
}

import { DB } from "~/db";
import { index } from "~/factory/api/classes/index";
import { execute } from "~/tasks";

export function cleanAll(this: DB) {
  let self = this
  return execute(
    [
      {
        name: `Clean all indexes`,
        task() {
          return self.query(index.cleanAll());
        },
      },
    ],
    {
      domain: "DB.indexes.cleanAll",
    }
  );
}

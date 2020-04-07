import { DB } from "~/db";
import { collection } from "~/factory/api/classes/collection";
import { execute } from "~/tasks";

export function cleanAll(this: DB) {
  let self = this;
  return execute(
    [
      {
        name: `Clean all collections`,
        task() {
          return self.query(collection.cleanAll());
        },
      },
    ],
    {
      domain: "DB.collections.cleanAll",
    }
  );
}

import { FaunaIndexOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { index } from "~/factory/api/classes/index";
import { execute } from "~/tasks";

export function update(this: DB, indexName: string) {
  let self = this;

  return async function updateMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Update (${indexName})`,
          task() {
            return self.query(index.update.call(self, indexName, options));
          },
        },
      ],
      {
        domain: "DB.index.update",
      }
    );
  };
}

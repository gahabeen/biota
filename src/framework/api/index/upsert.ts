import { FaunaIndexOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { index } from "~/factory/api/classes/index";
import { execute } from "~/tasks";

export function upsert(this: DB, indexName: string) {
  let self = this;

  return async function upsertMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Upsert (${indexName})`,
          task() {
            return self.query(index.upsert.call(self, indexName, options));
          },
        },
      ],
      {
        domain: "DB.index.upsert",
      }
    );
  };
}

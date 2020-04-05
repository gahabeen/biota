import { FaunaIndexOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { index } from "~/factory/api/classes/index";
import { execute } from "~/tasks";

export function replace(this: DB, indexName: string) {
  let self = this;

  return async function replaceMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Update (${indexName})`,
          task() {
            return self.query(index.replace(indexName, options));
          },
        },
      ],
      {
        domain: "DB.index.replace",
      }
    );
  };
}

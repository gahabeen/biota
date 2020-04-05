import { FaunaIndexOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { index } from "~/factory/api/classes/index";
import { execute } from "~/tasks";

export function forget(this: DB, indexName: string) {
  let self = this;

  return async function forgetMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Forget (${indexName})`,
          task() {
            return self.query(index.forget(indexName));
          },
        },
      ],
      {
        domain: "DB.index.forget",
      }
    );
  };
}

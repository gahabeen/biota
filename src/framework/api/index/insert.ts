import { FaunaIndexOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { index } from "~/factory/api/classes/index";
import { execute } from "~/tasks";

export function insert(this: DB, indexName: string) {
  let self = this;

  return async function insertMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Insert (${indexName})`,
          task() {
            return self.query(index.insert(indexName, options));
          },
        },
      ],
      {
        domain: "DB.index.insert",
      }
    );
  };
}

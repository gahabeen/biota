import { FaunaIndexOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { index } from "~/factory/api/classes/index";
import { execute } from "~/tasks";

export function repsert(this: DB, indexName: string) {
  let self = this;

  return async function repsertMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Repsert (${indexName})`,
          task() {
            return self.query(index.repsert.call(self, indexName, options));
          },
        },
      ],
      {
        domain: "DB.index.repsert",
      }
    );
  };
}

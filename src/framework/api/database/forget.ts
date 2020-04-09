import { FaunaId } from "~/../types/fauna";
import { DB } from "~/db";
import { database } from "~/factory/api/classes/database";
import { execute } from "~/tasks";

export function forget(this: DB, databaseName: string) {
  let self = this;

  return async function forgetMethod() {
    return execute(
      [
        {
          name: `Forget database [${databaseName}]`,
          task() {
            return self.query(database.forget.call(self, databaseName));
          },
        },
      ],
      {
        domain: "DB.database.forget",
      }
    );
  };
}

import { FaunaPaginateOptions } from "~/../types/fauna";
import { DB } from "~/db";
import { Identity } from "~/factory/api/ql";
import { collectionNameNormalized } from "~/factory/classes/collection";
import { execute } from "~/tasks";

export async function activity(this: DB, pagination: FaunaPaginateOptions = {}) {
  let self = this;
  return execute(
    [
      {
        name: `User activity`,
        async task() {
          return self.collection(collectionNameNormalized("actions")).find(
            {
              user: Identity(),
            },
            pagination
          );
        },
      },
    ],
    {
      domain: "DB.user.activity",
    }
  );
}

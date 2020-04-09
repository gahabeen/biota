import { query as q } from "faunadb";
import { FaunaId } from "~/../types/fauna";
import { DB } from "~/db";
import { Identity } from "~/factory/api/ql";
import { collectionNameNormalized } from "~/factory/classes/collection";
import { execute } from "~/tasks";

export function delete_(this: DB) {
  let self = this;
  return execute(
    [
      {
        name: `Delete me`,
        task() {
          return self.document(collectionNameNormalized("users"), q.Select("id", Identity())).delete();
        },
      },
    ],
    {
      domain: "DB.user.delete",
    }
  );
}

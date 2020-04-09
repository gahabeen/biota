import { FaunaId } from "~/../types/fauna";
import { DB } from "~/db";
import { Identity } from "~/factory/api/ql";
import { collectionNameNormalized } from "~/factory/classes/collection";
import { execute } from "~/tasks";
import { query as q } from "faunadb";

export function replace(this: DB, data: object) {
  let self = this;
  return execute(
    [
      {
        name: `Replace me`,
        task() {
          return self.document(collectionNameNormalized("users"), q.Select("id", Identity())).replace(data);
        },
      },
    ],
    {
      domain: "DB.user.replace",
    }
  );
}

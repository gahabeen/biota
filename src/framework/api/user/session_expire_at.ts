import { DB } from "~/db";
import { execute } from "~/tasks";
import { query as q } from "faunadb";
import { document } from "~/factory/api/classes/document";
import { collectionNameNormalized } from "~/factory/classes/collection";

export async function expireAt(this: DB, at:any) {
  let self = this;
  return execute(
    [
      {
        name: `Expire session at [${at}]`,
        task() {
          return self.query(document.expireAt(collectionNameNormalized("user_sessions"), q.Select("id", q.Identity()), at));
        },
      },
    ],
    {
      domain: "DB.user.session.expireAt",
    }
  );
}

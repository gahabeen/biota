import { DB } from "~/db";
import { execute } from "~/tasks";
import { query as q } from "faunadb";
import { document } from "~/factory/api/classes/document";
import { collectionNameNormalized } from "~/factory/classes/collection";

export async function delete_(this: DB) {
  let self = this;
  return execute(
    [
      {
        name: `Delete session`,
        task() {
          return self.query(document.delete.call(self, collectionNameNormalized("user_sessions"), q.Select("id", q.Identity())));
        },
      },
    ],
    {
      domain: "DB.user.session.delete",
    }
  );
}

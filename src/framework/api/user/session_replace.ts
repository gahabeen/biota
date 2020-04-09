import { DB } from "~/db";
import { execute } from "~/tasks";
import { query as q } from "faunadb";
import { document } from "~/factory/api/classes/document";
import { collectionNameNormalized } from "~/factory/classes/collection";

export async function replace(this: DB, data = {}) {
  let self = this;
  return execute(
    [
      {
        name: `Replace session data`,
        task() {
          return self.query(document.replace.call(self, collectionNameNormalized("user_sessions"), q.Select("id", q.Identity()), data));
        },
      },
    ],
    {
      domain: "DB.user.session.replace",
    }
  );
}

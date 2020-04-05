import { query as q } from "faunadb";
import { FaunaRoleOptions } from "~/../types/fauna";
import { collectionNameNormalized } from "~/factory/classes/collection";
import { Privilege, Role, roleNameNormalized } from "~/factory/classes/role";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { has_role } from "~/framework/default/rules/has_role";

export const user: FaunaRoleOptions = Role({
  name: roleNameNormalized("user"),
  membership: {
    resource: q.Collection(collectionNameNormalized("user_sessions")),
    predicate: q.Query(
      q.Lambda(
        "ref",
        q.Let(
          {
            session: q.Get(q.Var("ref")),
            is_valid: q.GTE(q.Select(["data", "expire_at"], q.Var("session"), q.ToTime(0)), q.Now()),
          },
          q.If(
            q.Var("is_valid"),
            q.Let(
              {
                user: q.Get(q.Select("user", q.Var("session"), null)),
              },
              has_role(q.Var("user"), roleNameNormalized("user"))
            ),
            false
          )
        )
      )
    ),
  },
  privileges: [
    /**
     * Indexes
     */

    /**
     * Collections
     */

    Privilege({
      resource: q.Collection(collectionNameNormalized("users")),
      actions: { read: "self" },
    }),

    /**
     * Functions
     */

    Privilege({
      resource: q.Function(udfunctionNameNormalized("SearchQuery")),
      actions: { call: "all" },
    }),
  ],
});

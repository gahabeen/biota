import { query as q } from "faunadb";
import { FaunaRoleOptions } from "~/../types/fauna";
import { collectionNameNormalized } from "~/factory/classes/collection";
import { Privilege, Role, roleNameNormalized, CustomPrivilege } from "~/factory/classes/role";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { has_role } from "../rules/has_role";
import { is_document_available } from "../rules/is_document_available";
import { Identity } from "~/factory/api/ql";

export const user: FaunaRoleOptions = Role({
  name: roleNameNormalized("user"),
  membership: [
    {
      resource: q.Collection(collectionNameNormalized("user_sessions")),
      predicate: q.Query(
        q.Lambda(
          "ref",
          q.Let(
            {
              doc: q.Get(q.Var("ref")),
              is_valid: is_document_available,
            },
            q.If(
              q.Var("is_valid"),
              q.Let(
                {
                  user: q.Get(q.Select(["data", "_membership", "owner"], q.Var("doc"), null)),
                },
                has_role(q.Var("user"), roleNameNormalized("user"))
              ),
              false
            )
          )
        )
      ),
    },
  ],
  privileges: [
    /**
     * Indexes
     */

    /**
     * Collections
     */

    CustomPrivilege({
      resource: q.Collection(collectionNameNormalized("actions")),
      actions: {
        read: q.Query(
          q.Lambda(
            "ref",
            q.Let(
              {
                user: q.Select(["data", "user"], q.Get(q.Var("ref"))),
              },
              q.If(q.IsRef(q.Var("user")), q.Equals(q.Var("user"), Identity()), false)
            )
          )
        ),
      },
    }),

    Privilege({
      resource: q.Collection(collectionNameNormalized("users")),
      actions: {
        read: ["self", "owner", "assignee"],
        write: ["self", "owner", "assignee"],
        // history_read: "self_own",
        // history_write: "self_own",
      },
    }),

    Privilege({
      resource: q.Collection(collectionNameNormalized("user_sessions")),
      actions: {
        read: ["self", "owner", "assignee"],
        write: ["self", "owner", "assignee"],
      }, // , "secured_fields"
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

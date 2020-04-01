// types
import { FaunaRoleOptions } from "~/../types/db";
// imports
import { query as q } from "faunadb";
// factory
import { Role, Privilege, CustomPrivilege } from "~/factory/classes/role";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
// framework
import { has_role } from "~/framework/default/rules/has_role";
import { wrapDoc } from "~/framework/helpers/wrapDoc";
// import { is_document_available } from "~/framework/default/rules/is_document_available";

export const user: FaunaRoleOptions = Role({
  name: "user",
  membership: {
    resource: q.Collection("users"),
    predicate: q.Query(q.Lambda("ref", wrapDoc("ref", has_role("user"))))
  },
  privileges: [
    /**
     * Indexes
     */

    /**
     * Collections
     */

    Privilege({
      resource: q.Collection("users"),
      actions: { read: "self" }
    }),

    /**
     * Functions
     */

    Privilege({
      resource: q.Function(udfunctionNameNormalized("SearchQuery")),
      actions: { call: "all" }
    })
  ]
});

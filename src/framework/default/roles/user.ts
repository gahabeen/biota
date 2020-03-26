// types
import { FaunaRoleOptions } from "~/../types/db";
// imports
import { query as q } from "faunadb";
// lib
import { Role, Privilege, CustomPrivilege } from "~/factory/api/role";
// local
import { has_role } from "~/framework/default/rules/has_role";
import { is_document_available } from "~/framework/default/rules/is_document_available";

export const User: FaunaRoleOptions = Role({
  name: "User",
  membership: {
    resource: q.Collection("users"),
    predicate: q.Query(has_role("User"))
  },
  privileges: [
    // collections
    CustomPrivilege({
      resource: q.Collection("users"),
      actions: {
        // create: q.Query(very_safe_query),
        delete: false,
        read: q.Query(is_document_available),
        // write: q.Query(very_safe_query),
        history_read: false,
        history_write: false,
        unrestricted_read: false
      }
    }),
    // indexes

    // functions
    Privilege({ resource: q.Function("Match"), actions: { call: "all" } }),
    Privilege({ resource: q.Function("Owner"), actions: { call: "all" } }),
    Privilege({
      resource: q.Function("ChangePassword"),
      actions: { call: "all" }
    }),
    Privilege({ resource: q.Function("Assign"), actions: { call: "all" } }),
    Privilege({ resource: q.Function("Import"), actions: { call: "all" } }),
    Privilege({ resource: q.Function("Create"), actions: { call: "all" } }),
    Privilege({ resource: q.Function("Update"), actions: { call: "all" } }),
    Privilege({ resource: q.Function("Replace"), actions: { call: "all" } }),
    Privilege({ resource: q.Function("Expire"), actions: { call: "all" } }),
    Privilege({ resource: q.Function("Delete"), actions: { call: "all" } }),
    Privilege({ resource: q.Function("Archive"), actions: { call: "all" } })
  ]
});

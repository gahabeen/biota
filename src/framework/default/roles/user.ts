// types
import { FaunaRoleOptions } from "~/../types/db";
// imports
import { query as q } from "faunadb";
// factory
import { Role, Privilege, CustomPrivilege } from "~/factory/api/role";
import { BiotaUDFunctionName } from "~/factory/api/udfunction";
// framework
import { has_role } from "~/framework/default/rules/has_role";
import { wrapDoc } from "~/framework/helpers/wrapDoc";
import { is_document_available } from "~/framework/default/rules/is_document_available";

export const user: FaunaRoleOptions = Role({
  name: "user",
  membership: {
    resource: q.Collection("users"),
    predicate: q.Query(q.Lambda("ref", wrapDoc("ref", has_role("user"))))
  },
  privileges: [
    // collections
    CustomPrivilege({
      resource: q.Collection("users"),
      actions: {
        // create: q.Query(very_safe_query),
        delete: false,
        read: q.Query(q.Lambda("ref", wrapDoc("ref", is_document_available))),
        // write: q.Query(very_safe_query),
        history_read: false,
        history_write: false,
        unrestricted_read: false
      }
    }),
    // indexes

    // functions
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Match")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Owner")), actions: { call: "all" } }),
    // Privilege({
    //   resource: q.Function(BiotaUDFunctionName("ChangePassword")),
    //   actions: { call: "all" }
    // }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Assign")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Import")), actions: { call: "all" } }),
    Privilege({
      resource: q.Function(BiotaUDFunctionName("Create")),
      actions: { call: "all" }
    }),
    Privilege({
      resource: q.Function(BiotaUDFunctionName("Update")),
      actions: { call: "all" }
    })
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Replace")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Expire")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Delete")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Archive")), actions: { call: "all" } })
  ]
});

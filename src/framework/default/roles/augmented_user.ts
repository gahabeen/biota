// types
import { FaunaRoleOptions } from "~/../types/db";
// imports
import { query as q } from "faunadb";
// lib
import { Role, Privilege } from "~/factory/api/role";
import { BiotaUDFunctionName } from "~/factory/api/udfunction";
import { has_role } from "~/framework/default/rules/has_role";
import { wrapDoc } from "~/framework/helpers/wrapDoc";
import { is_first_argument_identity } from "~/framework/api/default/rules";

export const augmented_user: FaunaRoleOptions = {
  name: "augmented_user",
  membership: {
    resource: q.Collection("users"),
    predicate: q.Query(q.Lambda("ref", wrapDoc("ref", has_role("user"))))
  },
  privileges: [
    Privilege({
      resource: q.Function(BiotaUDFunctionName("Create")),
      actions: { call: q.Query(is_first_argument_identity) }
    })
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Match")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Owner")), actions: { call: "all" } }),
    // Privilege({
    //   resource: q.Function(BiotaUDFunctionName("ChangePassword")),
    //   actions: { call: "all" }
    // }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Assign")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Import")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Update")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Replace")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Expire")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Delete")), actions: { call: "all" } }),
    // Privilege({ resource: q.Function(BiotaUDFunctionName("Archive")), actions: { call: "all" } })
  ]
};

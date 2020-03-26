// types
import { FaunaRoleOptions } from "~/../types/db";
// imports
import { query as q } from "faunadb";
// lib
// import * as fn from '~/factory/function'
// import * as rule from '~/factory/rule'
import { Role, Action, Privilege, CustomPrivilege } from "~/factory/api/role";
// local
import { has_role } from "../rules/has_role";

export const Advanced = Role({
  name: "Advanced",
  membership: {
    resource: q.Collection("users"),
    predicate: q.Query(has_role("Advanced"))
  },
  privileges: [
    // Privilege({
    //   resource: q.Function(fn.MatchHidden.name),
    //   actions: { call:"all" }
    // })
  ]
});

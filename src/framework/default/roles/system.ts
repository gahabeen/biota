// types
import { FaunaRoleOptions } from "~/../types/db";
// imports
import { query as q } from "faunadb";
// lib
import { Role, Privilege } from "~/factory/api/role";
import { BiotaUDFunctionName } from "~/factory/api/udfunction";
import { BiotaIndexName } from "~/factory/api/index";
import { has_role } from "~/framework/default/rules/has_role";
import { wrapDoc } from "~/framework/helpers/wrapDoc";
import { is_first_argument_identity } from "~/framework/api/default/rules";

export const system: FaunaRoleOptions = {
  name: "system",
  privileges: [
    /**
     * Indexes
     */

    Privilege({
      resource: q.Indexes(),
      actions: { read: "all", unrestricted_read: "all" }
    }),

    Privilege({
      resource: q.Index(BiotaIndexName("indexes__by__resource")),
      actions: { read: "all", unrestricted_read: "all" }
    }),

    Privilege({
      resource: q.Index(BiotaIndexName("indexes__by__terms")),
      actions: { read: "all", unrestricted_read: "all" }
    }),

    /**
     * Functions
     */

    Privilege({
      resource: q.Function(BiotaUDFunctionName("FindIndex")),
      actions: { call: "all" }
    })
  ]
};

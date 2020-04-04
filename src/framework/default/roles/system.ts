// types
import { FaunaRoleOptions } from "~/../types/fauna";
// imports
import { query as q } from "faunadb";
// lib
import { Role, Privilege } from "~/factory/classes/role";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { indexNameNormalized } from "~/factory/classes/index";
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
      resource: q.Index(indexNameNormalized("indexes__by__resource")),
      actions: { read: "all", unrestricted_read: "all" }
    }),

    Privilege({
      resource: q.Index(indexNameNormalized("indexes__by__terms")),
      actions: { read: "all", unrestricted_read: "all" }
    }),

    /**
     * Functions
     */

    Privilege({
      resource: q.Function(udfunctionNameNormalized("FindIndex")),
      actions: { call: "all" }
    })
  ]
};

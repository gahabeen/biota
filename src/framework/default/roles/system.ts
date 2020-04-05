import { query as q } from "faunadb";
import { FaunaRoleOptions } from "~/../types/fauna";
import { indexNameNormalized } from "~/factory/classes/index";
import { Privilege, roleNameNormalized } from "~/factory/classes/role";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const system: FaunaRoleOptions = {
  name: roleNameNormalized("system"),
  privileges: [
    /**
     * Indexes
     */

    Privilege({
      resource: q.Indexes(),
      actions: { read: "all", unrestricted_read: "all" },
    }),

    Privilege({
      resource: q.Index(indexNameNormalized("indexes__by__resource")),
      actions: { read: "all", unrestricted_read: "all" },
    }),

    Privilege({
      resource: q.Index(indexNameNormalized("indexes__by__terms")),
      actions: { read: "all", unrestricted_read: "all" },
    }),

    /**
     * Functions
     */

    Privilege({
      resource: q.Function(udfunctionNameNormalized("FindIndex")),
      actions: { call: "all" },
    }),
  ],
};

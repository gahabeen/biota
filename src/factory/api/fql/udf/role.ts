import { query as q } from "faunadb";
import { DBFactorySpecificRoleApi } from "~/../types/factory/factory.specific.role";
import { DB } from "~/db";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { Identity } from "../../ql";
import { role as roleFQLBase } from "~/factory/api/fql/base/role";

export const role: DBFactorySpecificRoleApi = {
  //
  membership: {
    upsert(this: DB, nameExpr, membership) {
      return q.Call(udfunctionNameNormalized("UpsertRole"), Identity(), q.Var("private_key"), nameExpr, {
        membership: roleFQLBase.membership.distinct(nameExpr, membership),
      });
    },
    delete(this: DB, nameExpr, resource) {
      return q.Call(udfunctionNameNormalized("UpsertRole"), Identity(), q.Var("private_key"), nameExpr, {
        membership: roleFQLBase.membership.difference(nameExpr, resource),
      });
    },
  },

  privilege: {
    upsert(this: DB, nameExpr, privilege) {
      return q.Call(udfunctionNameNormalized("UpsertRole"), Identity(), q.Var("private_key"), nameExpr, {
        privileges: roleFQLBase.privileges.distinct(nameExpr, privilege),
      });
      // fql.base.upsert.role(nameExpr, { privileges: q.Var("new_privileges") as FaunaRolePrivilege[] })
    },
    delete(this: DB, nameExpr, resource) {
      return q.Call(udfunctionNameNormalized("UpsertRole"), Identity(), q.Var("private_key"), nameExpr, {
        privileges: roleFQLBase.privileges.difference(nameExpr, resource),
      });
    },
  },
};

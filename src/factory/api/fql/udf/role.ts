import { query as q } from "faunadb";
import { DBFactorySpecificRoleApi } from "~/../types/factory/factory.specific.role";
import { DB } from "~/db";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { Identity } from "../../ql";

export const role: DBFactorySpecificRoleApi = {
  //
  membership: {
    upsert(this: DB, nameExpr, membership) {
      return q.Let(
        {
          membership,
          membership_resource: q.Select("resource", q.Var("membership")),
          current_membership_raw: q.Select("membership", q.Get(q.Role(nameExpr)), []),
          current_membership: q.If(
            q.IsObject(q.Var("current_membership_raw")),
            [q.Var("current_membership_raw")],
            q.Var("current_membership_raw")
          ),
          same_current_membership: q.Filter(
            q.Var("current_membership"),
            q.Lambda("cm", q.Equals(q.Select("resource", q.Var("cm")), q.Var("membership_resource")))
          ),
          current_membership_except_new: q.Filter(
            q.Var("current_membership"),
            q.Lambda("cm", q.Not(q.Equals(q.Select("resource", q.Var("cm")), q.Var("membership_resource"))))
          ),
          new_membership: q.Merge(q.Var("membership"), q.Var("same_current_membership")),
          new_membership_array: q.Append(q.Var("current_membership_except_new"), [q.Var("new_membership")]),
        },
        // fql.base.upsert.role(nameExpr, { membership: q.Var("new_membership_array") })
        q.Call(udfunctionNameNormalized("UpsertRole"), Identity(), q.Var("private_key"), nameExpr, { membership: q.Var("new_membership") })
        // call.upsert.role.call(this, nameExpr, { membership: q.Var("new_membership") })
      );
    },
    delete(this: DB, nameExpr, resource) {
      return q.Let(
        {
          resource,
          current_membership_raw: q.Select("membership", q.Get(q.Role(nameExpr)), []),
          current_membership: q.If(
            q.IsObject(q.Var("current_membership_raw")),
            [q.Var("current_membership_raw")],
            q.Var("current_membership_raw")
          ),
          membership_filtered: q.Filter(
            q.Var("current_membership"),
            q.Lambda("cm", q.Not(q.Equals(q.Select("resource", q.Var("cm")), q.Var("resource"))))
          ),
        },
        // fql.base.upsert.role(nameExpr, { membership: q.Var("membership_filtered") })
        // call.upsert.role.call(this, nameExpr, { membership: q.Var("membership_filtered") })
        q.Call(udfunctionNameNormalized("UpsertRole"), Identity(), q.Var("private_key"), nameExpr, {
          membership: q.Var("membership_filtered"),
        })
      );
    },
  },

  privilege: {
    upsert(this: DB, nameExpr, privilege) {
      // #bug WRAP INTO A FUNCTION
      return q.Let(
        {
          privilege,
          privilege_resource: q.Select("resource", q.Var("privilege")),
          has_privilege_resource: q.If(q.IsRef(q.Var("privilege_resource")), true, q.Abort("Privilege doesn't have a resource")),
          current_privilege_raw: q.Select("privileges", q.Get(q.Role(nameExpr)), []),
          current_privilege: q.If(
            q.IsObject(q.Var("current_privilege_raw")),
            [q.Var("current_privilege_raw")],
            q.Var("current_privilege_raw")
          ),
          same_current_privilege: q.Filter(
            q.Var("current_privilege"),
            q.Lambda("cm", q.Equals(q.Select("resource", q.Var("cm")), q.Var("privilege_resource")))
          ),
          current_privilege_except_new: q.Filter(
            q.Var("current_privilege"),
            q.Lambda("cm", q.Not(q.Equals(q.Select("resource", q.Var("cm")), q.Var("privilege_resource"))))
          ),
          new_privilege: q.Merge(q.Var("privilege"), q.Var("same_current_privilege")),
          new_privileges: q.Append(q.Var("current_privilege_except_new"), [q.Var("new_privilege")]),
        },
        // fql.base.upsert.role(nameExpr, { privileges: q.Var("new_privileges") as FaunaRolePrivilege[] })
        // q.Var("new_privileges")
        // call.upsert.role.call(this, nameExpr, q.Var("wrapper_new_privileges"))
        q.Call(udfunctionNameNormalized("UpsertRole"), Identity(), q.Var("private_key"), nameExpr, { privileges: q.Var("new_privileges") })
      );
    },
    delete(this: DB, nameExpr, resource) {
      return q.Let(
        {
          resource,
          current_privileges_raw: q.Select("privileges", q.Get(q.Role(nameExpr)), []),
          current_privileges: q.If(
            q.IsObject(q.Var("current_privileges_raw")),
            [q.Var("current_privileges_raw")],
            q.Var("current_privileges_raw")
          ),
          privileges_filtered: q.Filter(
            q.Var("current_privileges"),
            q.Lambda("cm", q.Not(q.Equals(q.Select("resource", q.Var("cm")), q.Var("resource"))))
          ),
        },
        // fql.base.upsert.role(nameExpr, { privileges: q.Var("privileges_filtered") as FaunaRolePrivilege[] })
        // call.upsert.role.call(this, nameExpr, { privileges: q.Var("privileges_filtered") as FaunaRolePrivilege[] })
        q.Call(udfunctionNameNormalized("UpsertRole"), Identity(), q.Var("private_key"), nameExpr, {
          privileges: q.Var("privileges_filtered"),
        })
      );
    },
  },
};

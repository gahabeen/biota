import { query as q } from "faunadb";
import { DBFactoryRoleApi } from "~/../types/factory/factory.classes";
import * as udf from "~/factory/api/udf";
import * as fql from "~/factory/api/fql";
import { FaunaRolePrivilege } from "~/../types/fauna";

export const role: DBFactoryRoleApi = {
  all() {
    return udf.get.roles();
  },
  cleanAll() {
    return udf.clean.roles();
  },
  clean(name) {
    return udf.clean.role(name);
  },
  get(name) {
    return udf.get.role(name);
  },
  insert(name, options) {
    return udf.insert.role(name, options);
  },
  update(name, options) {
    return udf.update.role(name, options);
  },
  replace(name, options) {
    return udf.replace.role(name, options);
  },
  upsert(name, options) {
    return udf.upsert.role(name, options);
  },
  repsert(name, options) {
    return udf.repsert.role(name, options);
  },
  delete(name) {
    return udf.delete.role(name);
  },
  forget(name) {
    return udf.forget.role(name);
  },
  membership: {
    upsert(name, membership) {
      return q.Let(
        {
          membership,
          membership_resource: q.Select("resource", q.Var("membership")),
          current_membership_raw: q.Select("membership", q.Get(q.Role(name)), []),
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
        // fql.base.upsert.role(name, { membership: q.Var("new_membership_array") })
        udf.upsert.role(name, { membership: q.Var("new_membership") })
      );
    },
    delete(name, resource) {
      return q.Let(
        {
          resource,
          current_membership_raw: q.Select("membership", q.Get(q.Role(name)), []),
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
        // fql.base.upsert.role(name, { membership: q.Var("membership_filtered") })
        udf.upsert.role(name, { membership: q.Var("membership_filtered") })
      );
    },
  },
  privilege: {
    upsert(name, privilege) {
      return q.Let(
        {
          privilege,
          privilege_resource: q.Select("resource", q.Var("privilege")),
          has_privilege_resource: q.If(q.IsRef(q.Var("privilege_resource")), true, q.Abort("Privilege doesn't have a resource")),
          current_privilege_raw: q.Select("privileges", q.Get(q.Role(name)), []),
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
        // fql.base.upsert.role(name, { privileges: q.Var("new_privileges") as FaunaRolePrivilege[] })
        udf.upsert.role(name, { privileges: q.Var("new_privileges") as FaunaRolePrivilege[] })
      );
    },
    delete(name, resource) {
      return q.Let(
        {
          resource,
          current_privileges_raw: q.Select("privileges", q.Get(q.Role(name)), []),
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
        // fql.base.upsert.role(name, { privileges: q.Var("privileges_filtered") as FaunaRolePrivilege[] })
        udf.upsert.role(name, { privileges: q.Var("privileges_filtered") as FaunaRolePrivilege[] })
      );
    },
  },
};

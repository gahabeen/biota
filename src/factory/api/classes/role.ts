import { query as q } from "faunadb";
import { DBFactoryRoleApi } from "~/../types/factory/factory.classes";
import { FaunaRolePrivilege } from "~/../types/fauna";
import { DB } from "~/db";
import * as call from "~/factory/api/call";
import * as fql from "~/factory/api/fql";

export const role: DBFactoryRoleApi = {
  all(this: DB) {
    return call.get.roles.call(this);
  },
  cleanAll(this: DB) {
    return call.clean.roles.call(this);
  },
  clean(this: DB, name) {
    return call.clean.role.call(this, name);
  },
  get(this: DB, name) {
    return call.get.role.call(this, name);
  },
  insert(this: DB, name, options) {
    return call.insert.role.call(this, name, options);
  },
  update(this: DB, name, options) {
    return call.update.role.call(this, name, options);
  },
  replace(this: DB, name, options) {
    return call.replace.role.call(this, name, options);
  },
  upsert(this: DB, name, options) {
    return call.upsert.role.call(this, name, options);
  },
  repsert(this: DB, name, options) {
    return call.repsert.role.call(this, name, options);
  },
  delete(this: DB, name) {
    return call.delete.role.call(this, name);
  },
  forget(this: DB, name) {
    return call.forget.role.call(this, name);
  },
  membership: {
    upsert(this: DB, name, membership) {
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
        call.upsert.role.call(this, name, { membership: q.Var("new_membership") })
      );
    },
    delete(this: DB, name, resource) {
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
        call.upsert.role.call(this, name, { membership: q.Var("membership_filtered") })
      );
    },
  },
  // privileges: {
  //   upsert(this: DB, name, privileges) {
  //     return q.Let(
  //       {
  //         privilege,
  //         privilege_resource: q.Select("resource", q.Var("privilege")),
  //         has_privilege_resource: q.If(q.IsRef(q.Var("privilege_resource")), true, q.Abort("Privilege doesn't have a resource")),
  //         current_privilege_raw: q.Select("privileges", q.Get(q.Role(name)), []),
  //         current_privilege: q.If(
  //           q.IsObject(q.Var("current_privilege_raw")),
  //           [q.Var("current_privilege_raw")],
  //           q.Var("current_privilege_raw")
  //         ),
  //         same_current_privilege: q.Filter(
  //           q.Var("current_privilege"),
  //           q.Lambda("cm", q.Equals(q.Select("resource", q.Var("cm")), q.Var("privilege_resource")))
  //         ),
  //         current_privilege_except_new: q.Filter(
  //           q.Var("current_privilege"),
  //           q.Lambda("cm", q.Not(q.Equals(q.Select("resource", q.Var("cm")), q.Var("privilege_resource"))))
  //         ),
  //         new_privilege: q.Merge(q.Var("privilege"), q.Var("same_current_privilege")),
  //         new_privileges: q.Append(q.Var("current_privilege_except_new"), [q.Var("new_privilege")]),
  //       },
  //       // fql.base.upsert.role(name, { privileges: q.Var("new_privileges") as FaunaRolePrivilege[] })
  //       call.upsert.role.call(this, name, { privileges: q.Var("new_privileges") as FaunaRolePrivilege[] })
  //     );
  //   },
  // },
  privilege: {
    upsert(this: DB, name, privilege) {
      // #bug WRAP INTO A FUNCTION
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
          wrapper_new_privileges: { privileges: q.Var("new_privileges") },
        },
        // fql.base.upsert.role(name, { privileges: q.Var("new_privileges") as FaunaRolePrivilege[] })
        // q.Var("new_privileges")
        call.upsert.role.call(this, name, q.Var("wrapper_new_privileges"))
      );
    },
    delete(this: DB, name, resource) {
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
        fql.base.upsert.role(name, { privileges: q.Var("privileges_filtered") as FaunaRolePrivilege[] })
        // call.upsert.role.call(this, name, { privileges: q.Var("privileges_filtered") as FaunaRolePrivilege[] })
      );
    },
  },
};

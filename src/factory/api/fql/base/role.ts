import { query as q } from "faunadb";
import { DBFactoryFQLBaseRole } from "~/../types/factory/factory.fql.base";
import { upsert as upsertFQLBase } from "~/factory/api/fql/base/upsert";
import { repsert as repsertFQLBase } from "~/factory/api/fql/base/repsert";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { FaunaRolePrivilege } from "~/../types/fauna";

export const role: DBFactoryFQLBaseRole = {
  membership: {
    distinct(nameExpr, membership) {
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
          new_membership: q.Merge(q.Select(0, q.Var("same_current_membership"), {}), q.Var("membership")),
          new_membership_array: q.Append(q.Var("current_membership_except_new"), [q.Var("new_membership")]),
        },
        q.Var("new_membership_array")
      );
    },
    difference(nameExpr, resourceExpr) {
      return q.Let(
        {
          resource: resourceExpr,
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
        q.Var("membership_filtered")
      );
    },
    upsert(nameExpr, membership) {
      return upsertFQLBase.role(nameExpr, {
        membership: role.membership.distinct(nameExpr, membership),
      });
    },
    repsert(nameExpr, membership) {
      return repsertFQLBase.role(nameExpr, {
        membership: role.membership.distinct(nameExpr, membership),
      });
    },
    delete(nameExpr, resource) {
      return upsertFQLBase.role(nameExpr, {
        membership: role.membership.difference(nameExpr, resource),
      });
    },
  },
  privileges: {
    distinct(nameExpr, privilege) {
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
          new_privilege: q.Merge(q.Select(0, q.Var("same_current_privilege"), {}), q.Var("privilege")),
          new_privileges: q.Append(q.Var("current_privilege_except_new"), [q.Var("new_privilege")]),
        },
        q.Var("new_privileges")
      );
    },
    difference(nameExpr, resourceExpr) {
      return q.Let(
        {
          resource: resourceExpr,
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
        q.Var("privileges_filtered")
      );
    },
    upsert(nameExpr, privilege) {
      return upsertFQLBase.role(nameExpr, {
        privileges: role.privileges.distinct(nameExpr, privilege) as FaunaRolePrivilege[],
      });
    },
    repsert(nameExpr, privilege) {
      return repsertFQLBase.role(nameExpr, {
        privileges: role.privileges.distinct(nameExpr, privilege) as FaunaRolePrivilege[],
      });
    },
    delete(nameExpr, resource) {
      return upsertFQLBase.role(nameExpr, {
        privileges: role.privileges.difference(nameExpr, resource) as FaunaRolePrivilege[],
      });
    },
  },
};

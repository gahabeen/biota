// types
import { DBFactoryUpdate, FaunaRoleOptions } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { nameOrOptions } from "~/helpers";

export const update: DBFactoryUpdate = {
  database: function databaseUpdate(name, options) {
    return q.Update(q.Database(name), options);
  },
  collection: function collectionUpdate(name, options) {
    return q.Update(q.Collection(name), options);
  },
  index: function indexUpdate(name, options) {
    return q.Update(q.Index(name), options);
  },
  function: function functionUpdate(name, options) {
    return q.Update(q.Function(name), options);
  },
  role: function roleUpdate(name, options = {}) {
    let definition: FaunaRoleOptions = nameOrOptions(name, options);
    let membership = definition.membership || [];
    if (!Array.isArray(membership)) membership = [membership];
    let privileges = definition.privileges || [];
    return q.Let(
      {
        role: q.Get(q.Role(definition.name)),
        memberships: q.Select("membership", q.Var("role"), []),
        privileges: q.Select("privileges", q.Var("role"), []),
        membershipArray: q.If(
          q.IsArray(q.Var("memberships")),
          q.Var("memberships"),
          [q.Var("memberships")]
        ),
        filteredPrivileges: q.Filter(
          q.Var("privileges"),
          q.Lambda(
            "privilege",
            q.Let(
              {
                checks: q.Map(
                  privileges,
                  q.Lambda(
                    "newPrivilege",
                    q.Not(
                      q.Equals(
                        q.Select("resource", q.Var("privilege"), -1),
                        q.Select("resource", q.Var("newPrivilege"), -1)
                      )
                    )
                  )
                )
              },
              q.If(q.IsEmpty(q.Var("checks")), true, q.And(q.Var("checks")))
            )
          )
        ),
        filteredMembership: q.Filter(
          q.Var("membershipArray"),
          q.Lambda(
            "membership",
            q.Let(
              {
                checks: q.Map(
                  membership,
                  q.Lambda(
                    "newMembership",
                    q.Not(
                      q.Equals(
                        q.Select("resource", q.Var("membership"), -1),
                        q.Select("resource", q.Var("newMembership"), -1)
                      )
                    )
                  )
                )
              },
              q.If(q.IsEmpty(q.Var("checks")), true, q.And(q.Var("checks")))
            )
          )
        )
      },
      q.Update(q.Role(definition.name), {
        name: definition.name,
        membership: q.Distinct(
          q.Union(q.Var("filteredMembership"), definition.membership || [])
        ),
        privileges: q.Distinct(
          q.Union(q.Var("filteredPrivileges"), definition.privileges || [])
        )
      })
    );
  },
  token: function tokenUpdate(id, options) {
    return q.Update(q.Ref(q.Tokens(), id), options);
  },
  key: function keyUpdate(id, options) {
    return q.Update(q.Ref(q.Keys(), id), options);
  }
};

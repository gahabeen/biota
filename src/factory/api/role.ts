import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryRole } from '~/../types/factory/factory.role';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const role: FactoryContext<FactoryRole> = function (context): FactoryRole {
  // tslint:disable-next-line: only-arrow-functions
  return (nameOrRef) => {
    const roleApi = role(context);
    const ref = q.If(q.IsRole(nameOrRef), nameOrRef, q.Role(nameOrRef));
    const name = q.If(q.IsString(nameOrRef), nameOrRef, q.Select('id', ref));
    return {
      get() {
        return q.Get(ref);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        return q.CreateRole(q.Merge(options, { name }));
      },
      update(options) {
        options = DefaultToOjbect(options);
        return q.Update(ref, options);
      },
      upsert(options) {
        return q.If(q.Exists(ref), roleApi(ref).update(options), roleApi(ref).insert(options));
      },
      replace(options) {
        options = DefaultToOjbect(options);
        return q.Replace(ref, options);
      },
      repsert(options) {
        return q.If(q.Exists(ref), roleApi(ref).replace(options), roleApi(ref).insert(options));
      },
      delete() {
        return '';
      },
      forget() {
        return q.Delete(ref);
      },
      clean() {
        return q.If(q.Exists(ref), roleApi(ref).forget(), false);
      },
      membership: {
        distinct(membership) {
          return q.Let(
            {
              membership_resource: q.Select('resource', membership),
              current_membership_raw: q.Select('membership', q.Get(q.Role(name)), []),
              current_membership: q.If(
                q.IsObject(q.Var('current_membership_raw')),
                [q.Var('current_membership_raw')],
                q.Var('current_membership_raw'),
              ),
              same_current_membership: q.Filter(
                q.Var('current_membership'),
                q.Lambda('cm', q.Equals(q.Select('resource', q.Var('cm')), q.Var('membership_resource'))),
              ),
              current_membership_except_new: q.Filter(
                q.Var('current_membership'),
                q.Lambda('cm', q.Not(q.Equals(q.Select('resource', q.Var('cm')), q.Var('membership_resource')))),
              ),
              new_membership: q.Merge(q.Select(0, q.Var('same_current_membership'), {}), membership),
              new_memberships: q.Append(q.Var('current_membership_except_new'), [q.Var('new_membership')]),
            },
            q.Var('new_memberships'),
          );
        },
        difference(resource) {
          return q.Let(
            {
              current_membership_raw: q.Select('membership', q.Get(ref), []),
              current_membership: q.If(
                q.IsObject(q.Var('current_membership_raw')),
                [q.Var('current_membership_raw')],
                q.Var('current_membership_raw'),
              ),
              membership_filtered: q.Filter(
                q.Var('current_membership'),
                q.Lambda('cm', q.Not(q.Equals(q.Select('resource', q.Var('cm')), resource))),
              ),
            },
            q.Var('membership_filtered'),
          );
        },
        set(membership) {
          return roleApi(ref).upsert({
            membership: roleApi(ref).membership.distinct(membership),
          });
        },
        remove(resource) {
          return roleApi(ref).upsert({
            membership: roleApi(ref).membership.difference(resource),
          });
        },
      },
      privileges: {
        distinct(privilege) {
          return q.Let(
            {
              privilege_resource: q.Select('resource', privilege),
              has_privilege_resource: q.If(q.IsRef(q.Var('privilege_resource')), true, q.Abort("Privilege doesn't have a resource")),
              current_privilege_raw: q.Select('privileges', q.Get(ref), []),
              current_privilege: q.If(
                q.IsObject(q.Var('current_privilege_raw')),
                [q.Var('current_privilege_raw')],
                q.Var('current_privilege_raw'),
              ),
              same_current_privilege: q.Filter(
                q.Var('current_privilege'),
                q.Lambda('cm', q.Equals(q.Select('resource', q.Var('cm')), q.Var('privilege_resource'))),
              ),
              current_privilege_except_new: q.Filter(
                q.Var('current_privilege'),
                q.Lambda('cm', q.Not(q.Equals(q.Select('resource', q.Var('cm')), q.Var('privilege_resource')))),
              ),
              new_privilege: q.Merge(q.Select(0, q.Var('same_current_privilege'), {}), privilege),
              new_privileges: q.Append(q.Var('current_privilege_except_new'), [q.Var('new_privilege')]),
            },
            q.Var('new_privileges'),
          );
        },
        difference(resource) {
          return q.Let(
            {
              current_privileges_raw: q.Select('privileges', q.Get(ref), []),
              current_privileges: q.If(
                q.IsObject(q.Var('current_privileges_raw')),
                [q.Var('current_privileges_raw')],
                q.Var('current_privileges_raw'),
              ),
              privileges_filtered: q.Filter(
                q.Var('current_privileges'),
                q.Lambda('cm', q.Not(q.Equals(q.Select('resource', q.Var('cm')), resource))),
              ),
            },
            q.Var('privileges_filtered'),
          );
        },
        set(privilege) {
          return roleApi(ref).upsert({
            privileges: roleApi(ref).privileges.distinct(privilege),
          });
        },
        remove(resource) {
          return roleApi(ref).upsert({
            privileges: roleApi(ref).privileges.difference(resource),
          });
        },
      },
    };
  };
};

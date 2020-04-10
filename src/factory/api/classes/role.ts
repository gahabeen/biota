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
      return call.role.membership.upsert.call(this, name, membership);
    },
    repsert(this: DB, name, membership) {
      return call.role.membership.repsert.call(this, name, membership);
    },
    delete(this: DB, name, resource) {
      return call.role.membership.repsert.call(this, name, resource);
    },
  },
  privilege: {
    upsert(this: DB, name, privilege) {
      return call.role.privilege.upsert.call(this, name, privilege);
    },
    repsert(this: DB, name, privilege) {
      return call.role.privilege.repsert.call(this, name, privilege);
    },
    delete(this: DB, name, resource) {
      return call.role.privilege.repsert.call(this, name, resource);
    },
  },
};

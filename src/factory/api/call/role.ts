import { query as q } from 'faunadb';
import { DBFactoryCallRole } from '~/../types/factory/factory.call';
import { Identity } from '~/factory/api/ql';
import { udfunctionNameNormalized as udfName } from '~/factory/classes/udfunction';
import { DB } from '~/db';

export const role: DBFactoryCallRole = {
  membership: {
    upsert(this: DB, name, membership) {
      return q.Call(udfName('RoleUpsertMembership'), Identity(), this.private_key, name, membership);
    },
    repsert(this: DB, name, membership) {
      return q.Call(udfName('RoleRepsertMembership'), Identity(), this.private_key, name, membership);
    },
    delete(this: DB, name, resource) {
      return q.Call(udfName('RoleDeleteMembership'), Identity(), this.private_key, name, resource);
    },
  },
  privilege: {
    upsert(this: DB, name, privilege) {
      return q.Call(udfName('RoleUpsertPrivilege'), Identity(), this.private_key, name, privilege);
    },
    repsert(this: DB, name, privilege) {
      return q.Call(udfName('RoleRepsertPrivilege'), Identity(), this.private_key, name, privilege);
    },
    delete(this: DB, name, resource) {
      return q.Call(udfName('RoleDeletePrivilege'), Identity(), this.private_key, name, resource);
    },
  },
};

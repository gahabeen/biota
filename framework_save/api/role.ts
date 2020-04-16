import { FrameworkRoleApi } from '~/../types/framework/framework.role';
import { activity } from '~/framework/api/role/activity';
import { delete_ } from '~/framework/api/role/delete';
import { forget } from '~/framework/api/role/forget';
import { get } from '~/framework/api/role/get';
import { replace } from '~/framework/api/role/replace';
import { repsert } from '~/framework/api/role/repsert';
import { update } from '~/framework/api/role/update';
import { upsert } from '~/framework/api/role/upsert';
import { insert } from '~/framework/api/role/insert';
import { membershipUpsert } from '~/framework/api/role/membership_upsert';
import { membershipRepsert } from '~/framework/api/role/membership_repsert';
import { membershipDelete } from '~/framework/api/role/membership_delete';
import { privilegeUpsert } from '~/framework/api/role/privilege_upsert';
import { privilegeRepsert } from '~/framework/api/role/privilege_repsert';
import { privilegeDelete } from '~/framework/api/role/privilege_delete';

export function role(roleName: string): FrameworkRoleApi {
  const self = this;

  if (!roleName) {
    throw new Error('biota.role() - no valid collection or id');
  }

  return {
    activity: activity.call(self, roleName),
    get: get.call(self, roleName),
    insert: insert.call(self, roleName),
    replace: replace.call(self, roleName),
    update: update.call(self, roleName),
    repsert: repsert.call(self, roleName),
    upsert: upsert.call(self, roleName),
    delete: delete_.call(self, roleName),
    forget: forget.call(self, roleName),
    membership: {
      upsert: membershipUpsert.call(self, roleName),
      repsert: membershipRepsert.call(self, roleName),
      delete: membershipDelete.call(self, roleName),
    },
    privilege: {
      upsert: privilegeUpsert.call(self, roleName),
      repsert: privilegeRepsert.call(self, roleName),
      delete: privilegeDelete.call(self, roleName),
    },
    async changes() {},
  };
}

import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { activity } from '~/framework/api/role/activity';
import { delete_ } from '~/framework/api/role/delete';
import { forget } from '~/framework/api/role/forget';
import { get } from '~/framework/api/role/get';
import { insert } from '~/framework/api/role/insert';
import { replace } from '~/framework/api/role/replace';
import { repsert } from '~/framework/api/role/repsert';
import { update } from '~/framework/api/role/update';
import { upsert } from '~/framework/api/role/upsert';
import { drop } from '~/framework/api/role/drop';
import { restore } from '~/framework/api/role/restore';
import { expireAt } from '~/framework/api/role/expireAt';
import { expireIn } from '~/framework/api/role/expireIn';
import { expireNow } from '~/framework/api/role/expireNow';
import { membershipSet } from '~/framework/api/role/membership_set';
import { membershipSetMany } from '~/framework/api/role/membership_setMany';
import { membershipRemove } from '~/framework/api/role/membership_remove';
import { membershipRemoveMany } from '~/framework/api/role/membership_removeMany';
import { privilegeSet } from '~/framework/api/role/privilege_set';
import { privilegeSetMany } from '~/framework/api/role/privilege_setMany';
import { privilegeRemove } from '~/framework/api/role/privilege_remove';
import { privilegeRemoveMany } from '~/framework/api/role/privilege_removeMany';
import { privilegescaffoldMany } from './role/privilege_scaffoldMany';
import { privilegeScaffold } from './role/privilege_scaffold';
import { remember } from './role/remember';

export function role(roleName: string): FrameworkRoleApi {
  const self = this;

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
    drop: drop.call(self, roleName),
    remember: remember.call(self, roleName),
    restore: restore.call(self, roleName),
    expireAt: expireAt.call(self, roleName),
    expireIn: expireIn.call(self, roleName),
    expireNow: expireNow.call(self, roleName),
    membership: {
      set: membershipSet.call(self, roleName),
      setMany: membershipSetMany.call(self, roleName),
      remove: membershipRemove.call(self, roleName),
      removeMany: membershipRemoveMany.call(self, roleName),
    },
    privilege: {
      set: privilegeSet.call(self, roleName),
      setMany: privilegeSetMany.call(self, roleName),
      scaffold: privilegeScaffold.call(self, roleName),
      scaffoldMany: privilegescaffoldMany.call(self, roleName),
      remove: privilegeRemove.call(self, roleName),
      removeMany: privilegeRemoveMany.call(self, roleName),
    },
  };
}

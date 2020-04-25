import { activity } from '~/framework/api/role/activity';
import { delete_ } from '~/framework/api/role/delete';
import { drop } from '~/framework/api/role/drop';
import { expireAt } from '~/framework/api/role/expireAt';
import { expireIn } from '~/framework/api/role/expireIn';
import { expireNow } from '~/framework/api/role/expireNow';
import { forget } from '~/framework/api/role/forget';
import { get } from '~/framework/api/role/get';
import { insert } from '~/framework/api/role/insert';
import { membershipRemove } from '~/framework/api/role/membership_remove';
import { membershipRemoveMany } from '~/framework/api/role/membership_removeMany';
import { membershipSet } from '~/framework/api/role/membership_set';
import { membershipSetMany } from '~/framework/api/role/membership_setMany';
import { privilegeRemove } from '~/framework/api/role/privilege_remove';
import { privilegeRemoveMany } from '~/framework/api/role/privilege_removeMany';
import { privilegeSet } from '~/framework/api/role/privilege_set';
import { privilegeSetMany } from '~/framework/api/role/privilege_setMany';
import { replace } from '~/framework/api/role/replace';
import { repsert } from '~/framework/api/role/repsert';
import { restore } from '~/framework/api/role/restore';
import { update } from '~/framework/api/role/update';
import { upsert } from '~/framework/api/role/upsert';
import { inputStringLiteral } from '~/helpers/literals';
import { FrameworkRole } from '~/types/framework/framework.role';
import { privilegeScaffold } from './role/privilege_scaffold';
import { privilegescaffoldMany } from './role/privilege_scaffoldMany';
import { remember } from './role/remember';

// #bug
export const role: FrameworkRole = function (...args) {
  const [roleName] = inputStringLiteral(args);

  return {
    activity: activity.call(this, roleName),
    get: get.call(this, roleName),
    insert: insert.call(this, roleName),
    replace: replace.call(this, roleName),
    update: update.call(this, roleName),
    repsert: repsert.call(this, roleName),
    upsert: upsert.call(this, roleName),
    delete: delete_.call(this, roleName),
    forget: forget.call(this, roleName),
    drop: drop.call(this, roleName),
    remember: remember.call(this, roleName),
    restore: restore.call(this, roleName),
    expireAt: expireAt.call(this, roleName),
    expireIn: expireIn.call(this, roleName),
    expireNow: expireNow.call(this, roleName),
    membership: {
      set: membershipSet.call(this, roleName),
      setMany: membershipSetMany.call(this, roleName),
      remove: membershipRemove.call(this, roleName),
      removeMany: membershipRemoveMany.call(this, roleName),
    },
    privilege: {
      set: privilegeSet.call(this, roleName),
      setMany: privilegeSetMany.call(this, roleName),
      scaffold: privilegeScaffold.call(this, roleName),
      scaffoldMany: privilegescaffoldMany.call(this, roleName),
      remove: privilegeRemove.call(this, roleName),
      removeMany: privilegeRemoveMany.call(this, roleName),
    },
  };
};

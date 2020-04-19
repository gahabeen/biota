import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import * as foundationRoles from '~/factory/api/foundation/roles';
import { execute } from '~/tools/tasks';
import { Biota } from '~/biota';

export const scaffold: FrameworkRolesApi['scaffold'] = async function (this: Biota, options) {
  const self = this;
  const { defaultRoles, baseOnly = false } = options || {};

  const roles = defaultRoles || ['user', 'system'];
  const tasks = [];

  if (baseOnly) {
    for (const role of roles) {
      if (foundationRoles[role]) {
        tasks.push({
          name: `Creating (base) role: ${foundationRoles[role].name}`,
          task() {
            return self.role(foundationRoles[role].name).repsert({
              name: foundationRoles[role].name,
              privileges: [],
              membership: [],
            });
          },
        });
      }
    }
  } else {
    for (const role of roles) {
      if (foundationRoles[role]) {
        tasks.push({
          name: `Creating (base) role: ${foundationRoles[role].name}`,
          task() {
            return self.role(foundationRoles[role].name).upsert(foundationRoles[role]);
          },
        });
      }
    }
  }

  return execute(tasks, {
    domain: 'Biota.roles.scaffold',
  });
};

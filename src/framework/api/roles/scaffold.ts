import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import * as foundationRoles from '~/factory/api/foundation/roles';
import { execute } from '~/tools/tasks';
import { Biota } from '~/biota';

export const scaffold: FrameworkRolesApi['scaffold'] = async function (this: Biota, options) {
  const self = this;
  const { baseOnly = false } = options || {};
  const tasks = [];

  if (baseOnly) {
    for (const role of Object.keys(foundationRoles)) {
      if (foundationRoles[role]) {
        tasks.push({
          name: `Creating (base) role: ${foundationRoles[role].name}`,
          task() {
            return self.role(foundationRoles[role].name).repsert({
              name: foundationRoles[role].name,
              membership: [],
              privileges: [],
            });
          },
        });
      }
    }
  } else {
    for (const role of Object.keys(foundationRoles)) {
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
    singleResult: false,
  });
};

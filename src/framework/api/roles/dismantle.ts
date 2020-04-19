import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { CONVENTION } from '~/consts';
import { execute } from '~/tools/tasks';
import { FrameworkRolesApi } from '~/types/framework/framework.roles';

export const dismantle: FrameworkRolesApi['dismantle'] = async function (this: Biota) {
  const self = this;
  const tasks = [];

  const rolesCursor = self.paginate(q.Roles(), { size: 100 });
  for await (const rolesBatch of rolesCursor) {
    const { data = [] } = rolesBatch || {};

    for (const role of data) {
      if (role.name.startsWith(CONVENTION.ROLE_PREFIX)) {
        tasks.push({
          name: `Dismantling role: ${role.name}`,
          task() {
            return self.role(role.name).drop();
          },
        });
      }
    }
  }

  return execute(tasks, {
    domain: 'Biota.roles.dismantle',
  });
};

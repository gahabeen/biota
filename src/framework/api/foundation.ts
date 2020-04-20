import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { FoundationOptions } from '~/types/framework/framework.foundation';

export async function foundation(this: Biota, options: FoundationOptions) {
  const self = this;
  options = { roles: true, udfunctions: false, collections: true, indexes: true, ...options };
  const tasks = [];

  /**
   *  Collections (creation)
   */

  if (options.collections) {
    tasks.push({
      name: `Scaffolding collections`,
      task() {
        return self.collections.scaffold().then((res) => ({ collections: res }));
      },
    });
  }

  /**
   *  Roles (base)
   */

  if (options.roles) {
    tasks.push({
      name: `Scaffolding (base) roles`,
      task() {
        return self.roles.scaffold({ baseOnly: true }).then((res) => ({ roles: res }));
      },
    });
  }

  /**
   *  Functions
   */

  tasks.push({
    name: `Scaffolding UDFunctions`,
    task() {
      return self.udfunctions.scaffold({ onlyNecessary: !options.udfunctions }).then((res) => ({ udfunctions: res }));
    },
  });

  /**
   *  Indexes
   */

  if (options.indexes) {
    tasks.push({
      name: `Scaffolding indexes`,
      task() {
        return self.indexes.scaffold().then((res) => ({ indexes: res }));
      },
    });
  }

  /**
   *  Roles (functions privileges)
   */

  if (options.roles) {
    tasks.push({
      name: `Scaffolding roles`,
      task() {
        return self.roles.scaffold().then((res) => ({ roles: res }));
      },
    });
  }

  return execute(tasks, {
    domain: 'Biota.foundation',
    singleResult: false,
  });
}

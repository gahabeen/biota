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
        return self.collections.scaffold();
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
        return self.roles.scaffold({ baseOnly: true });
      },
    });
  }

  /**
   *  Functions
   */

  if (options.udfunctions) {
    tasks.push({
      name: `Scaffolding UDFunctions`,
      task() {
        return self.udfunctions.scaffold();
      },
    });
  }

  /**
   *  Indexes
   */

  if (options.indexes) {
    tasks.push({
      name: `Scaffolding indexes`,
      task() {
        return self.indexes.scaffold();
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
        return self.roles.scaffold();
      },
    });
  }

  return execute(tasks, {
    domain: 'Biota.foundation',
    singleResult: false
  });
}

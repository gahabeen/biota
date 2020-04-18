import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { FoundationOptions } from '~/types/framework/framework.foundation';

export async function foundation(this: Biota, options: FoundationOptions) {
  const self = this;
  options = { roles: true, udfunctions: true, collections: true, indexes: true, ...options };
  const tasks = [];

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
   *  Collections
   */

  if (options.collections) {
    tasks.push({
      name: `Scaffolding Collections`,
      task() {
        return self.collections.scaffold();
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
  });
}

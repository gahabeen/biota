import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { BiotaRoleName } from '~/factory/api/constructors';
import { execute } from '~/tools/tasks';
import { ScaffoldOptions } from '~/types/framework/framework.scaffold';

export async function scaffold(this: Biota, options: ScaffoldOptions) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
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

  /**
   *  Create public key
   */

  if (options.roles) {
    tasks.push({
      name: `Create public key`,
      task(_: any, debug: any) {
        return self.key``.insert({ role: q.Role(BiotaRoleName('public')) }).then((res) => {
          debug(`Public key: ${res?.data?.secret}`);
          return res;
        });
      },
    });
  }

  return execute(tasks, {
    domain: 'Biota.scaffold',
    singleResult: false,
  });
}

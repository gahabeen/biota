import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';

export async function dismantle(this: Biota) {
  const self = this;
  const tasks = [];

  /**
   *  Collections (creation)
   */

  tasks.push({
    name: `Dismantling collections`,
    task() {
      return self.collections.dismantle();
    },
  });

  /**
   *  Roles (base)
   */

  tasks.push({
    name: `Dismantling roles`,
    task() {
      return self.roles.dismantle();
    },
  });

  /**
   *  Functions
   */

  tasks.push({
    name: `Dismantling UDFunctions`,
    task() {
      return self.udfunctions.dismantle();
    },
  });

  /**
   *  Indexes
   */

  tasks.push({
    name: `Dismantling indexes`,
    task() {
      return self.indexes.dismantle();
    },
  });

  return execute(tasks, {
    domain: 'Biota.dismantle',
  });
}

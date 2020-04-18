import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';
import * as foundationIndexes from '~/factory/api/foundation/indexes';
import { execute } from '~/tools/tasks';
import { Biota } from '~/biota';
import { FaunaIndexOptions } from '~/types/fauna';

export const scaffold: FrameworkIndexesApi['scaffold'] = async function (this: Biota) {
  const self = this;
  const tasks = [];

  for (const index of Object.keys(foundationIndexes) as FaunaIndexOptions[]) {
    tasks.push({
      name: `Scaffolding index: ${index.name}`,
      task() {
        return self.index(index.name).upsert(index);
      },
    });
  }

  return execute(tasks, {
    domain: 'Biota.indexes.scaffold',
  });
};

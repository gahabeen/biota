import { Biota } from '~/biota';
import * as foundationIndexes from '~/factory/api/foundation/indexes';
import { execute } from '~/tools/tasks';
import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';

export const scaffold: FrameworkIndexesApi['scaffold'] = async function (this: Biota) {
  const self = this;
  const tasks = [];

  for (const index of Object.keys(foundationIndexes)) {
    const usesBindings = Object.keys(foundationIndexes[index].source.fields || {}).length > 0;
    if (!usesBindings) {
      tasks.push({
        name: `Scaffolding index: ${foundationIndexes[index].name}`,
        task() {
          return self.index(foundationIndexes[index].name).upsert(foundationIndexes[index]);
        },
      });
    }
  }

  return execute(tasks, {
    domain: 'Biota.indexes.scaffold',
    singleResult: false
  });
};

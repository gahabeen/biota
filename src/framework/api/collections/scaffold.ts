import { Biota } from '~/biota';
import * as foundationCollections from '~/factory/api/foundation/collections';
import { execute } from '~/tools/tasks';
import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';

export const scaffold: FrameworkCollectionsApi['scaffold'] = async function (this: Biota) {
  const self = this;
  const tasks = [];

  for (const collection of Object.keys(foundationCollections)) {
    tasks.push({
      name: `Scaffolding collection: ${foundationCollections[collection].name}`,
      task() {
        return self.collection(foundationCollections[collection].name).upsert(foundationCollections[collection]);
      },
    });
  }

  return execute(tasks, {
    domain: 'Biota.collections.scaffold',
    singleResult: false,
  });
};

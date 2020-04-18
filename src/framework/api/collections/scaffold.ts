import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import * as foundationCollections from '~/factory/api/foundation/collections';
import { execute } from '~/tools/tasks';
import { Biota } from '~/biota';
import { FaunaCollectionOptions } from '~/types/fauna';

export const scaffold: FrameworkCollectionsApi['scaffold'] = async function (this: Biota) {
  const self = this;
  const tasks = [];

  for (const collection of Object.keys(foundationCollections) as FaunaCollectionOptions[]) {
    tasks.push({
      name: `Scaffolding collection: ${collection.name}`,
      task() {
        return self.collection(collection.name).upsert(collection);
      },
    });
  }

  return execute(tasks, {
    domain: 'Biota.collections.scaffold',
  });
};

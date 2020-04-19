import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import * as foundationCollections from '~/factory/api/foundation/collections';
import { execute } from '~/tools/tasks';
import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { CONVENTION } from '~/consts';

export const dismantle: FrameworkCollectionsApi['dismantle'] = async function (this: Biota) {
  const self = this;
  const tasks = [];

  const collectionsCursor = self.paginate(q.Collections(), { size: 100 });
  for await (const collectionsBatch of collectionsCursor) {
    const { data = [] } = collectionsBatch || {};

    for (const collection of data) {
      if (collection.name.startsWith(CONVENTION.COLLECTION_PREFIX)) {
        tasks.push({
          name: `Dismantling collection: ${collection.name}`,
          task() {
            return self.collection(collection.name).drop();
          },
        });
      }
    }
  }

  return execute(tasks, {
    domain: 'Biota.collections.dismantle',
  });
};

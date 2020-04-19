import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { CONVENTION } from '~/consts';
import { execute } from '~/tools/tasks';
import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';

export const dismantle: FrameworkIndexesApi['dismantle'] = async function (this: Biota) {
  const self = this;
  const tasks = [];

  const indexesCursor = self.paginate(q.Indexes(), { size: 100 });
  for await (const indexesBatch of indexesCursor) {
    const { data = [] } = indexesBatch || {};
    for (const index of data) {
      if (index.name.startsWith(CONVENTION.INDEX_PREFIX)) {
        tasks.push({
          name: `Dismantling index: ${index.name}`,
          task() {
            return self.index(index.name).drop();
          },
        });
      }
    }
  }

  return execute(tasks, {
    domain: 'Biota.indexes.dismantle',
  });
};

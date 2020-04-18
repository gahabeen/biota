import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkIndexesApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all indexes`,
        task() {
          return self.query(indexes(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.indexes.findAll',
    },
  );
};

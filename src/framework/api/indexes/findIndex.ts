import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const findIndex: FrameworkIndexesApi['findIndex'] = async function (resource, termFields) {
  const self = this;

  return execute(
    [
      {
        name: `Find index`,
        task() {
          return self.query(indexes(self.context).findIndex(resource, termFields));
        },
      },
    ],
    {
      domain: 'Biota.indexes.findIndex',
    },
  );
};

import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkCollectionsApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all collections`,
        task() {
          return self.query(collections(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.collections.findAll',
    },
  );
};

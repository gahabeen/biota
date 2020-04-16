import { FrameworkCollectionsApi } from 'types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkCollectionsApi['expireManyNow'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many collections now`,
        task() {
          return self.query(collections(self.context).expireManyNow(nameList));
        },
      },
    ],
    {
      domain: 'Biota.collections.expireManyNow',
    },
  );
};

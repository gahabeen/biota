import { FrameworkCollectionsApi } from 'types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkCollectionsApi['expireManyAt'] = async function (nameList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many collections at ${at}`,
        task() {
          return self.query(collections(self.context).expireManyAt(nameList, at));
        },
      },
    ],
    {
      domain: 'Biota.collections.expireManyAt',
    },
  );
};

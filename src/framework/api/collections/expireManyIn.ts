import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkCollectionsApi['expireManyIn'] = async function (nameList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many collections in ${delay}ms`,
        task() {
          return self.query(collections(self.context).expireManyIn(nameList, delay));
        },
      },
    ],
    {
      domain: 'Biota.collections.expireManyIn',
    },
  );
};

import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkIndexesApi['expireManyNow'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many indexes now`,
        task() {
          return self.query(indexes(self.context).expireManyNow(nameList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.expireManyNow',
    },
  );
};

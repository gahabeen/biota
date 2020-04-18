import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkIndexesApi['expireManyAt'] = async function (nameList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many indexes at ${at}`,
        task() {
          return self.query(indexes(self.context).expireManyAt(nameList, at));
        },
      },
    ],
    {
      domain: 'Biota.indexes.expireManyAt',
    },
  );
};

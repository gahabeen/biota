import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const findByResource: FrameworkIndexesApi['findByResource'] = async function (resource = null, pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find by resource`,
        task() {
          return self.query(indexes(self.context).findByResource(resource, pagination));
        },
      },
    ],
    {
      domain: 'Biota.indexes.findByResource',
    },
  );
};

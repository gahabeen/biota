import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { CONVENTION } from '~/consts';

export const dismantle: FrameworkUDFunctionsApi['dismantle'] = async function (this: Biota) {
  const self = this;
  const tasks = [];

  const udfunctionsCursor = self.paginate(q.Functions(), { size: 100 });
  for await (const udfunctionsBatch of udfunctionsCursor) {
    const { data = [] } = udfunctionsBatch || {};

    for (const udfunction of data) {
      if (udfunction.name.startsWith(CONVENTION.UDFUNCTION_PREFIX)) {
        tasks.push({
          name: `Dismantling udfunction: ${udfunction.name}`,
          task() {
            return self.udfunction(udfunction.name).drop();
          },
        });
      }
    }
  }

  return execute(tasks, {
    domain: 'Biota.udfunctions.dismantle',
  });
};

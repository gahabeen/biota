import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { FaunaId } from '~/types/fauna';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const insert: FactorySession<FrameworkSessionApi['insert']> = function (idOrRef) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${idOrRef}]`,
          task() {
            return self.query(session(self.context)(idOrRef).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.session.insert',
      },
    );
  };
};

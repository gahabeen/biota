import { FactoryUser } from 'types/factory/factory.user';
import { FrameworkUserApi } from 'types/framework/framework.user';
import { FaunaId } from '~/../types/fauna';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const insert: FactoryUser<FrameworkUserApi['drop']> = function (idOrRef) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${idOrRef}]`,
          task() {
            return self.query(user(self.context)(idOrRef).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.user.insert',
      },
    );
  };
};

import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';

export const insert: FactoryUser<FrameworkUserApi['insert']> = function (id = null) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;
  return async function insertMethod(data: any = {}) {
    return execute(
      [
        {
          name: `Insert a user`,
          task() {
            return self.query(user(self.context)(id).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.user.insert',
      },
    );
  };
};

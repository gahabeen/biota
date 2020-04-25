import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const upsert: FactoryUser<FrameworkUserApi['upsert']> = function (id) {
  const self = this;

  return async function upsertMethod(data) {
    return execute(
      [
        {
          name: `Update/Insert (${id})`,
          task() {
            return self.query(user(self.context)(id).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.user.upsert',
      },
    );
  };
};

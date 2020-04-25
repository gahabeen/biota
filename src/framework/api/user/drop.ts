import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const drop: FactoryUser<FrameworkUserApi['drop']> = function (id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${id})`,
          task() {
            return self.query(user(self.context)(id).drop());
          },
        },
      ],
      {
        domain: 'Biota.user.drop',
      },
    );
  };
};

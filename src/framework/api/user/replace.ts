import { FactoryUser } from 'types/factory/factory.user';
import { FrameworkUserApi } from 'types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const replace: FactoryUser<FrameworkUserApi['replace']> = function (idOrRef) {
  const self = this;

  return async function replaceMethod(options) {
    return execute(
      [
        {
          name: `Replace (${idOrRef})`,
          task() {
            return self.query(user(self.context)(idOrRef).replace(options));
          },
        },
      ],
      {
        domain: 'Biota.user.replace',
      },
    );
  };
};
